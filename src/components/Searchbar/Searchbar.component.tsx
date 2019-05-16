// React
import React from "react";

// Material UI
import { Divider, IconButton, InputBase, Paper } from "@material-ui/core";

// Material Icon
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

const Searchbar = () => {
  return(
    <div className="Searchbar">
      <Paper className="Searchbar-paper" elevation={1}>
        <IconButton aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <InputBase className="Searchbar-input" placeholder="Search Flickr" />
        <Divider/>
        <IconButton className="Searhbar-searchButton" aria-label="Search">
          <SearchIcon/>
        </IconButton>
      </Paper>
    </div>
  );
};

export default Searchbar;
