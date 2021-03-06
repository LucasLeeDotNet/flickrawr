import * as jsbeautify from "js-beautify";
import * as vscode from "vscode";

const tabSize = vscode.workspace.getConfiguration('beautify').get<number>("tabSize") || vscode.workspace.getConfiguration('editor', null).get<number>("tabSize");
const options = vscode.workspace.getConfiguration('beautify').get<Object>("options");

export default class Beautifier {
    public static beautify(document: vscode.TextDocument, range?: vscode.Range): any {
        let editor = vscode.window.activeTextEditor;

        if (!editor) {
            return;
        }

        let start = new vscode.Position(0, 0);
        let end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);

        if (!editor.selection.isEmpty) {
            start = editor.selection.start;
            end = editor.selection.end;
        }

        range = new vscode.Range(start, end);
        let originalText: string = document.getText(range);
        let formattedText: string = jsbeautify.css(originalText, Object.assign({
            indent_size: tabSize
        }, options));

        if (formattedText && originalText !== formattedText) {
            editor.edit(function (editor) {
                range = new vscode.Range(start, end);
                editor.replace(range, formattedText);
            });
        }
        return formattedText;
    }
}