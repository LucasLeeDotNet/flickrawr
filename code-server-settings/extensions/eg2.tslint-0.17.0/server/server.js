/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch = require("minimatch");
const server = require("vscode-languageserver");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const vscode_uri_1 = require("vscode-uri");
const delayer_1 = require("./delayer");
class ID {
    static next() {
        return `${ID.base}${ID.counter++}`;
    }
}
ID.base = `${Date.now().toString()}-`;
ID.counter = 0;
function computeKey(diagnostic) {
    let range = diagnostic.range;
    return `[${range.start.line},${range.start.character},${range.end.line},${range.end.character}]-${diagnostic.code}`;
}
var Status;
(function (Status) {
    Status[Status["ok"] = 1] = "ok";
    Status[Status["warn"] = 2] = "warn";
    Status[Status["error"] = 3] = "error";
})(Status || (Status = {}));
var StatusNotification;
(function (StatusNotification) {
    StatusNotification.type = new server.NotificationType('tslint/status');
})(StatusNotification || (StatusNotification = {}));
var NoTSLintLibraryRequest;
(function (NoTSLintLibraryRequest) {
    NoTSLintLibraryRequest.type = new server.RequestType('tslint/noLibrary');
})(NoTSLintLibraryRequest || (NoTSLintLibraryRequest = {}));
var SettingsRequest;
(function (SettingsRequest) {
    SettingsRequest.type = new server.RequestType('textDocument/tslint/settings');
})(SettingsRequest || (SettingsRequest = {}));
let globalNodePath = undefined;
let nodePath = undefined;
let settings = null;
// if tslint < tslint4 then the linter is the module therefore the type `any`
let path2Library = new Map();
let document2Library = new Map();
let validationDelayer = new Map(); // key is the URI of the document
let tslintNotFound = `Failed to load tslint library. Please install tslint in your workspace
folder using \'npm install tslint\' or \'npm install -g tslint\' and then press Retry.`;
let tslintNotFoundIgnored = `[vscode-tslint] Failed to load tslint library. This failure is not reported to the user since there is no \'tslint.json\' in the workspace`;
let fixes = new Map();
let quoteFixCreator = (problem, document) => {
    // error message: ' should be "   or " should be '
    const wrongQuote = problem.getFailure()[0];
    const fixedQuote = wrongQuote === "'" ? '"' : "'";
    const contents = document.getText().slice(problem.getStartPosition().getPosition() + 1, problem.getEndPosition().getPosition() - 1);
    return {
        range: convertProblemPositionsToRange(problem),
        text: `${fixedQuote}${contents}${fixedQuote}`
    };
};
fixes['quotemark'] = quoteFixCreator;
let whiteSpaceFixCreator = (problem, document) => {
    // error message: 'missing whitespace'
    if (problem.getFailure() !== 'missing whitespace') {
        return null;
    }
    const contents = document.getText().slice(problem.getStartPosition().getPosition(), problem.getEndPosition().getPosition());
    return {
        range: convertProblemPositionsToRange(problem),
        text: ` ${contents}`
    };
};
fixes['whitespace'] = whiteSpaceFixCreator;
let tripleEqualsFixCreator = (problem, document) => {
    // error message: '== should be ===' or '!= should be !=='
    let contents = null;
    if (problem.getFailure() === '== should be ===') {
        contents = '===';
    }
    else if (problem.getFailure() === '!= should be !==') {
        contents = '!==';
    }
    else {
        return null;
    }
    return {
        range: convertProblemPositionsToRange(problem),
        text: `${contents}`
    };
};
fixes['triple-equals'] = tripleEqualsFixCreator;
let commentFormatFixCreator = (problem, document) => {
    // error messages:
    //   'comment must start with a space'
    //   'comment must start with lowercase letter'
    //   'comment must start with uppercase letter'
    function swapCase(contents, toLower) {
        let i = contents.search(/\S/);
        if (i === -1) {
            return contents;
        }
        let prefix = contents.substring(0, i);
        let swap = toLower ? contents[i].toLowerCase() : contents[i].toUpperCase();
        let suffix = contents.substring(i + 1);
        return `${prefix}${swap}${suffix}`;
    }
    let replacement;
    const contents = document.getText().slice(problem.getStartPosition().getPosition(), problem.getEndPosition().getPosition());
    switch (problem.getFailure()) {
        case 'comment must start with a space':
            replacement = ` ${contents}`;
            break;
        case 'comment must start with lowercase letter':
            replacement = swapCase(contents, true);
            break;
        case 'comment must start with uppercase letter':
            replacement = swapCase(contents, false);
            break;
        default:
            return null;
    }
    return {
        range: convertProblemPositionsToRange(problem),
        text: replacement
    };
};
fixes['comment-format'] = commentFormatFixCreator;
function convertToServerPosition(position) {
    return {
        character: position.getLineAndCharacter().character,
        line: position.getLineAndCharacter().line
    };
}
function convertProblemPositionsToRange(problem) {
    let startPosition = convertToServerPosition(problem.getStartPosition());
    let endPosition = convertToServerPosition(problem.getEndPosition());
    return [startPosition, endPosition];
}
function createVscFixForRuleFailure(problem, document) {
    let creator = fixes[problem.getRuleName()];
    if (creator) {
        return creator(problem, document);
    }
    return undefined;
}
exports.createVscFixForRuleFailure = createVscFixForRuleFailure;
let configFileWatchers = new Map();
let configCache = {
    filePath: null,
    configuration: null,
    isDefaultConfig: false
};
function makeDiagnostic(problem) {
    let message = (problem.getRuleName() !== null)
        ? `${problem.getFailure()} (${problem.getRuleName()})`
        : `${problem.getFailure()}`;
    let severity;
    let alwaysWarning = settings && settings.tslint.alwaysShowRuleFailuresAsWarnings;
    // tslint5 supports to assign severities to rules
    if (!alwaysWarning && problem.getRuleSeverity && problem.getRuleSeverity() === 'error') {
        severity = server.DiagnosticSeverity.Error;
    }
    else {
        severity = server.DiagnosticSeverity.Warning;
    }
    let diagnostic = {
        severity: severity,
        message: message,
        range: {
            start: {
                line: problem.getStartPosition().getLineAndCharacter().line,
                character: problem.getStartPosition().getLineAndCharacter().character
            },
            end: {
                line: problem.getEndPosition().getLineAndCharacter().line,
                character: problem.getEndPosition().getLineAndCharacter().character
            },
        },
        code: problem.getRuleName(),
        source: 'tslint'
    };
    return diagnostic;
}
let codeFixActions = new Map();
let codeDisableRuleActions = new Map();
function recordCodeAction(document, diagnostic, problem) {
    let documentDisableRuleFixes = codeDisableRuleActions[document.uri];
    if (!documentDisableRuleFixes) {
        documentDisableRuleFixes = Object.create(null);
        codeDisableRuleActions[document.uri] = documentDisableRuleFixes;
    }
    documentDisableRuleFixes[computeKey(diagnostic)] = createDisableRuleFix(problem, document);
    let fix = null;
    // tslint can return a fix with an empty replacements array, these fixes are ignored
    if (problem.getFix && problem.getFix() && !replacementsAreEmpty(problem.getFix())) { // tslint fixes are not available in tslint < 3.17
        fix = createAutoFix(problem, document, problem.getFix());
    }
    if (!fix) {
        let vscFix = createVscFixForRuleFailure(problem, document);
        if (vscFix) {
            fix = createAutoFix(problem, document, vscFix);
        }
    }
    if (!fix) {
        return;
    }
    let documentAutoFixes = codeFixActions[document.uri];
    if (!documentAutoFixes) {
        documentAutoFixes = Object.create(null);
        codeFixActions[document.uri] = documentAutoFixes;
    }
    documentAutoFixes[computeKey(diagnostic)] = fix;
}
function convertReplacementToAutoFix(document, repl) {
    let start = document.positionAt(repl.start);
    let end = document.positionAt(repl.end);
    return {
        range: [start, end],
        text: repl.text,
    };
}
function getConfiguration(filePath, library, configFileName) {
    if (configCache.configuration && configCache.filePath === filePath) {
        return configCache.configuration;
    }
    let isDefaultConfig = false;
    let configuration;
    let linter = getLinterFromLibrary(library);
    if (isTsLintVersion4(library)) {
        if (linter.findConfigurationPath) {
            isDefaultConfig = linter.findConfigurationPath(configFileName, filePath) === undefined;
        }
        let configurationResult = linter.findConfiguration(configFileName, filePath);
        // between tslint 4.0.1 and tslint 4.0.2 the attribute 'error' has been removed from IConfigurationLoadResult
        // in 4.0.2 findConfiguration throws an exception as in version ^3.0.0
        if (configurationResult.error) {
            throw configurationResult.error;
        }
        configuration = configurationResult.results;
    }
    else {
        // prior to tslint 4.0 the findconfiguration functions where attached to the linter function
        if (linter.findConfigurationPath) {
            isDefaultConfig = linter.findConfigurationPath(configFileName, filePath) === undefined;
        }
        configuration = linter.findConfiguration(configFileName, filePath);
    }
    configCache = {
        filePath: filePath,
        isDefaultConfig: isDefaultConfig,
        configuration: configuration
    };
    return configCache.configuration;
}
function flushConfigCache() {
    configCache = {
        filePath: null,
        configuration: null,
        isDefaultConfig: false
    };
}
function getErrorMessage(err, document) {
    let errorMessage = `unknown error`;
    if (typeof err.message === 'string' || err.message instanceof String) {
        errorMessage = err.message;
    }
    let fsPath = server.Files.uriToFilePath(document.uri);
    let message = `vscode-tslint: '${errorMessage}' while validating: ${fsPath} stacktrace: ${err.stack}`;
    return message;
}
function getConfigurationFailureMessage(err) {
    let errorMessage = `unknown error`;
    if (typeof err.message === 'string' || err.message instanceof String) {
        errorMessage = err.message;
    }
    return `vscode-tslint: Cannot read tslint configuration - '${errorMessage}'`;
}
function showConfigurationFailure(conn, err) {
    conn.console.info(getConfigurationFailureMessage(err));
    conn.sendNotification(StatusNotification.type, { state: Status.error });
}
function validateAllTextDocuments(conn, documents) {
    let tracker = new server.ErrorMessageTracker();
    documents.forEach(document => {
        try {
            validateTextDocument(conn, document);
        }
        catch (err) {
            tracker.add(getErrorMessage(err, document));
        }
    });
}
function getLinterFromLibrary(library) {
    let isTsLint4 = isTsLintVersion4(library);
    let linter;
    if (!isTsLint4) {
        linter = library;
    }
    else {
        linter = library.Linter;
    }
    return linter;
}
function validateTextDocument(connection, document) {
    let uri = document.uri;
    if (!document2Library.has(document.uri)) {
        loadLibrary(document.uri);
    }
    if (!document2Library.has(document.uri)) {
        return;
    }
    document2Library.get(document.uri).then((library) => {
        if (!library) {
            return;
        }
        try {
            let diagnostics = doValidate(connection, library, document);
            connection.sendDiagnostics({ uri, diagnostics });
            connection.sendNotification(StatusNotification.type, { state: Status.ok });
        }
        catch (err) {
            connection.window.showErrorMessage(getErrorMessage(err, document));
        }
    });
}
let connection = server.createConnection(new server.IPCMessageReader(process), new server.IPCMessageWriter(process));
let documents = new server.TextDocuments();
documents.listen(connection);
function trace(message, verbose) {
    connection.tracer.log(message, verbose);
}
connection.onInitialize((params) => {
    let initOptions = params.initializationOptions;
    nodePath = initOptions.nodePath;
    globalNodePath = server.Files.resolveGlobalNodePath();
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            codeActionProvider: true
        }
    };
});
function isTsLintVersion4(library) {
    let version = '1.0.0';
    try {
        version = library.Linter.VERSION;
    }
    catch (e) {
    }
    return !(semver.satisfies(version, "<= 3.x.x"));
}
function loadLibrary(docUri) {
    let uri = vscode_uri_1.default.parse(docUri);
    let promise;
    if (uri.scheme === 'file') {
        let file = uri.fsPath;
        let directory = path.dirname(file);
        if (nodePath) {
            promise = server.Files.resolve('tslint', nodePath, nodePath, trace).then(undefined, () => {
                return server.Files.resolve('tslint', globalNodePath, directory, trace);
            });
        }
        else {
            promise = server.Files.resolve('tslint', globalNodePath, directory, trace);
        }
    }
    else {
        promise = server.Files.resolve('tslint', globalNodePath, undefined, trace);
    }
    document2Library.set(docUri, promise.then((path) => {
        let library;
        if (!path2Library.has(path)) {
            library = require(path);
            connection.console.info(`TSLint library loaded from: ${path}`);
            path2Library.set(path, library);
        }
        return path2Library.get(path);
    }, () => {
        connection.sendRequest(NoTSLintLibraryRequest.type, { source: { uri: docUri } });
        return null;
    }));
}
function doValidate(conn, library, document) {
    let uri = document.uri;
    let diagnostics = [];
    delete codeFixActions[uri];
    delete codeDisableRuleActions[uri];
    let fsPath = server.Files.uriToFilePath(uri);
    if (!fsPath) {
        // tslint can only lint files on disk
        return diagnostics;
    }
    // Experiment with supporting settings in the multi root folder setup
    // connection.sendRequest(SettingsRequest.type, { textDocument: { uri } }).then((result) => {
    // 	connection.window.showErrorMessage('hello='+result.settings.tslint.configFile);
    // });
    if (fileIsExcluded(fsPath)) {
        return diagnostics;
    }
    let contents = document.getText();
    let configFile = settings.tslint.configFile || undefined;
    let configuration = null;
    try {
        configuration = getConfiguration(fsPath, library, configFile);
    }
    catch (err) {
        // this should not happen since we guard against incorrect configurations
        showConfigurationFailure(conn, err);
        return diagnostics;
    }
    if (isJsDocument(document) && !lintJsFiles()) {
        return diagnostics;
    }
    if (settings && settings.tslint && settings.tslint.validateWithDefaultConfig === false && configCache.isDefaultConfig) {
        return diagnostics;
    }
    if (configCache.isDefaultConfig && settings.tslint.validateWithDefaultConfig === false) {
        return;
    }
    let result;
    let options = {
        formatter: "json",
        fix: false,
        rulesDirectory: settings.tslint.rulesDirectory || undefined,
        formattersDirectory: undefined
    };
    try { // protect against tslint crashes
        let linter = getLinterFromLibrary(library);
        if (isTsLintVersion4(library)) {
            let tslint = new linter(options);
            tslint.lint(fsPath, contents, configuration);
            result = tslint.getResult();
        }
        // support for linting js files is only available in tslint > 4.0
        else if (!isJsDocument(document)) {
            options.configuration = configuration;
            let tslint = new linter(fsPath, contents, options);
            result = tslint.lint();
        }
        else {
            return diagnostics;
        }
    }
    catch (err) {
        conn.console.info(getErrorMessage(err, document));
        connection.sendNotification(StatusNotification.type, { state: Status.error });
        return diagnostics;
    }
    if (result.failures.length > 0) {
        filterProblemsForDocument(fsPath, result.failures).forEach(problem => {
            let diagnostic = makeDiagnostic(problem);
            diagnostics.push(diagnostic);
            recordCodeAction(document, diagnostic, problem);
        });
    }
    connection.sendNotification(StatusNotification.type, { state: Status.ok });
    return diagnostics;
}
/**
 * Filter failures for the given document
 */
function filterProblemsForDocument(documentPath, failures) {
    let normalizedPath = path.normalize(documentPath);
    // we only show diagnostics targetting this open document, some tslint rule return diagnostics for other documents/files
    let normalizedFiles = {};
    return failures.filter(each => {
        let fileName = each.getFileName();
        if (!normalizedFiles[fileName]) {
            normalizedFiles[fileName] = path.normalize(fileName);
        }
        return normalizedFiles[fileName] === normalizedPath;
    });
}
function isJsDocument(document) {
    return (document.languageId === "javascript" || document.languageId === "javascriptreact");
}
function lintJsFiles() {
    return settings && settings.tslint && settings.tslint.jsEnable;
}
function fileIsExcluded(path) {
    function testForExclusionPattern(path, pattern) {
        return minimatch(path, pattern);
    }
    if (settings && settings.tslint) {
        if (settings.tslint.ignoreDefinitionFiles) {
            if (minimatch(path, "**/*.d.ts")) {
                return true;
            }
        }
        if (settings.tslint.exclude) {
            if (Array.isArray(settings.tslint.exclude)) {
                for (let pattern of settings.tslint.exclude) {
                    if (testForExclusionPattern(path, pattern)) {
                        return true;
                    }
                }
            }
            else if (testForExclusionPattern(path, settings.tslint.exclude)) {
                return true;
            }
        }
    }
}
documents.onDidChangeContent((event) => {
    if (settings.tslint.run === 'onType') {
        triggerValidateDocument(event.document);
    }
});
documents.onDidSave((event) => {
    if (settings.tslint.run === 'onSave') {
        triggerValidateDocument(event.document);
    }
});
documents.onDidClose((event) => {
    // A text document was closed we clear the diagnostics
    connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
    document2Library.delete(event.document.uri);
});
function triggerValidateDocument(document) {
    let d = validationDelayer[document.uri];
    if (!d) {
        d = new delayer_1.Delayer(200);
        validationDelayer[document.uri] = d;
    }
    d.trigger(() => {
        validateTextDocument(connection, document);
        delete validationDelayer[document.uri];
    });
}
function tslintConfigurationValid() {
    try {
        documents.all().forEach((each) => {
            let fsPath = server.Files.uriToFilePath(each.uri);
            if (fsPath) {
                // TODO getConfiguration(fsPath, configFile);
            }
        });
    }
    catch (err) {
        connection.console.info(getConfigurationFailureMessage(err));
        connection.sendNotification(StatusNotification.type, { state: Status.error });
        return false;
    }
    return true;
}
// The VS Code tslint settings have changed. Revalidate all documents.
connection.onDidChangeConfiguration((params) => {
    flushConfigCache();
    settings = params.settings;
    // limitations:
    // - once a file is watched it continues being watched and triggering revalidation
    if (settings.tslint) {
        let configFile = settings.tslint.configFile || undefined;
        if (!configFile) {
            return;
        }
        if (!configFileWatchers.has(configFile)) {
            if (!fs.existsSync(configFile)) {
                connection.window.showWarningMessage(`The file ${configFile} refered to by 'tslint.configFile' does not exist`);
                return;
            }
            let watcher = fs.watch(configFile, { persistent: false }, (event, fileName) => {
                validateAllTextDocuments(connection, documents.all());
            });
            configFileWatchers.set(configFile, watcher);
        }
    }
    validateAllTextDocuments(connection, documents.all());
});
// The watched tslint.json has changed. Revalidate all documents, IF the configuration is valid.
connection.onDidChangeWatchedFiles((params) => {
    // Tslint 3.7 started to load configuration files using 'require' and they are now
    // cached in the node module cache. To ensure that the extension uses
    // the latest configuration file we remove the config file from the module cache.
    params.changes.forEach(element => {
        let configFilePath = server.Files.uriToFilePath(element.uri);
        let cached = require.cache[configFilePath];
        if (cached) {
            delete require.cache[configFilePath];
        }
    });
    flushConfigCache();
    if (tslintConfigurationValid()) {
        validateAllTextDocuments(connection, documents.all());
    }
});
connection.onCodeAction((params) => {
    let result = [];
    let uri = params.textDocument.uri;
    let documentVersion = -1;
    let ruleId;
    let documentFixes = codeFixActions[uri];
    if (documentFixes) {
        for (let diagnostic of params.context.diagnostics) {
            let autoFix = documentFixes[computeKey(diagnostic)];
            if (autoFix) {
                documentVersion = autoFix.documentVersion;
                ruleId = autoFix.problem.getRuleName();
                result.push(server.Command.create(autoFix.label, '_tslint.applySingleFix', uri, documentVersion, createTextEdit(autoFix)));
            }
        }
        if (result.length > 0) {
            let same = [];
            let all = [];
            let fixes = Object.keys(documentFixes).map(key => documentFixes[key]);
            fixes = sortFixes(fixes);
            for (let autofix of fixes) {
                if (documentVersion === -1) {
                    documentVersion = autofix.documentVersion;
                }
                if (autofix.problem.getRuleName() === ruleId && !overlaps(getLastEdit(same), autofix)) {
                    same.push(autofix);
                }
                if (!overlaps(getLastEdit(all), autofix)) {
                    all.push(autofix);
                }
            }
            // if the same rule warning exists more than once, provide a command to fix all these warnings
            if (same.length > 1) {
                result.push(server.Command.create(`Fix all: ${same[0].problem.getFailure()}`, '_tslint.applySameFixes', uri, documentVersion, concatenateEdits(same)));
            }
            // create a command to fix all the warnings with fixes
            if (all.length > 1) {
                result.push(server.Command.create(`Fix all auto-fixable problems`, '_tslint.applyAllFixes', uri, documentVersion, concatenateEdits(all)));
            }
        }
    }
    // add the fix to disable the rule
    let disableRuleFixes = codeDisableRuleActions[uri];
    if (disableRuleFixes) {
        for (let diagnostic of params.context.diagnostics) {
            let autoFix = disableRuleFixes[computeKey(diagnostic)];
            if (autoFix) {
                documentVersion = autoFix.documentVersion;
                ruleId = autoFix.problem.getRuleName();
                result.push(server.Command.create(autoFix.label, '_tslint.applyDisableRule', uri, documentVersion, createTextEdit(autoFix)));
            }
        }
    }
    // quick fix to show the rule documentation
    if (documentFixes) {
        for (let diagnostic of params.context.diagnostics) {
            let autoFix = disableRuleFixes[computeKey(diagnostic)];
            if (autoFix) {
                documentVersion = autoFix.documentVersion;
                let ruleId = autoFix.problem.getRuleName();
                result.push(server.Command.create(`Show documentation for "${ruleId}"`, '_tslint.showRuleDocumentation', uri, documentVersion, null, ruleId));
            }
        }
    }
    return result;
});
function replacementsAreEmpty(fix) {
    // in tslint 4 a Fix has a replacement property witht the Replacements
    if (fix.replacements) {
        return fix.replacements.length === 0;
    }
    // tslint 5
    if (Array.isArray(fix)) {
        return fix.length === 0;
    }
    return false;
}
function createAutoFix(problem, document, fix) {
    let edits = null;
    function isTslintAutofixEdit(fix) {
        return fix.range !== undefined;
    }
    if (isTslintAutofixEdit(fix)) {
        edits = [fix];
    }
    else {
        let ff = fix;
        // in tslint4 a Fix has a replacement property with the Replacements
        if (ff.replacements) {
            // tslint4
            edits = ff.replacements.map(each => convertReplacementToAutoFix(document, each));
        }
        else {
            // in tslint 5 a Fix is a Replacment | Replacement[]
            if (!Array.isArray(fix)) {
                fix = [fix];
            }
            edits = fix.map(each => convertReplacementToAutoFix(document, each));
        }
    }
    let autofix = {
        label: `Fix: ${problem.getFailure()}`,
        documentVersion: document.version,
        problem: problem,
        edits: edits,
    };
    return autofix;
}
function createDisableRuleFix(problem, document) {
    let pos = {
        character: 0,
        line: problem.getStartPosition().getLineAndCharacter().line
    };
    let disableEdit = {
        range: [pos, pos],
        // prefix to the text will be inserted on the client
        text: `// tslint:disable-next-line:${problem.getRuleName()}\n`
    };
    let disableFix = {
        label: `Disable rule "${problem.getRuleName()}"`,
        documentVersion: document.version,
        problem: problem,
        edits: [disableEdit]
    };
    return disableFix;
}
function sortFixes(fixes) {
    // The AutoFix.edits are sorted, so we sort on the first edit
    return fixes.sort((a, b) => {
        let editA = a.edits[0];
        let editB = b.edits[0];
        if (editA.range[0] < editB.range[0]) {
            return -1;
        }
        if (editA.range[0] > editB.range[0]) {
            return 1;
        }
        // lines are equal
        if (editA.range[1] < editB.range[1]) {
            return -1;
        }
        if (editA.range[1] > editB.range[1]) {
            return 1;
        }
        // characters are equal
        return 0;
    });
}
function overlaps(lastFix, nextFix) {
    if (!lastFix) {
        return false;
    }
    let doesOverlap = false;
    lastFix.edits.some(last => {
        return nextFix.edits.some(next => {
            if (last.range[1].line > next.range[0].line) {
                doesOverlap = true;
                return true;
            }
            else if (last.range[1].line < next.range[0].line) {
                return false;
            }
            else if (last.range[1].character >= next.range[0].character) {
                doesOverlap = true;
                return true;
            }
            return false;
        });
    });
    return doesOverlap;
}
exports.overlaps = overlaps;
function getLastEdit(array) {
    let length = array.length;
    if (length === 0) {
        return undefined;
    }
    return array[length - 1];
}
function getAllNonOverlappingFixes(fixes) {
    let nonOverlapping = [];
    fixes = sortFixes(fixes);
    for (let autofix of fixes) {
        if (!overlaps(getLastEdit(nonOverlapping), autofix)) {
            nonOverlapping.push(autofix);
        }
    }
    return nonOverlapping;
}
exports.getAllNonOverlappingFixes = getAllNonOverlappingFixes;
function createTextEdit(autoFix) {
    return autoFix.edits.map(each => server.TextEdit.replace(server.Range.create(each.range[0], each.range[1]), each.text || ''));
}
var AllFixesRequest;
(function (AllFixesRequest) {
    AllFixesRequest.type = new server.RequestType('textDocument/tslint/allFixes');
})(AllFixesRequest || (AllFixesRequest = {}));
connection.onRequest(AllFixesRequest.type, (params) => {
    let result = null;
    let uri = params.textDocument.uri;
    let isOnSave = params.isOnSave;
    let documentFixes = codeFixActions[uri];
    let documentVersion = -1;
    if (!documentFixes) {
        return null;
    }
    let fixes = Object.keys(documentFixes).map(key => documentFixes[key]);
    for (let fix of fixes) {
        if (documentVersion === -1) {
            documentVersion = fix.documentVersion;
            break;
        }
    }
    // Filter out fixes for problems that aren't defined to be autofixable on save
    if (isOnSave && Array.isArray(settings.tslint.autoFixOnSave)) {
        const autoFixOnSave = settings.tslint.autoFixOnSave;
        fixes = fixes.filter(fix => autoFixOnSave.indexOf(fix.problem.getRuleName()) > -1);
    }
    let allFixes = getAllNonOverlappingFixes(fixes);
    result = {
        documentVersion: documentVersion,
        edits: concatenateEdits(allFixes)
    };
    return result;
});
function concatenateEdits(fixes) {
    let textEdits = [];
    fixes.forEach(each => {
        textEdits = textEdits.concat(createTextEdit(each));
    });
    return textEdits;
}
connection.listen();
//# sourceMappingURL=server.js.map