import React, { Component } from 'react'

import { Grid, Paper } from '@material-ui/core'


export class ColorPicker extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            colors: this.props.colors ? this.props.colors : ["#F48FB1","#CE93D8", "#80CBC4", "#FFCC80", "#FFAB91"],
            selected: this.props.selected
        }
    }
    selectColor = (color) => {
        color = color === this.state.selected ? "#FFFFFF" : color
        this.setState({
            selected: color
        }, () => {
            this.props.selectColor(color)
        }) 
    }
    render() {
        return (
            this.props.display ?<Paper elevation = {0} style = {{transform: "translateX(12px)", marginBottom: "12px",maxWidth: "175px", padding: "4px"}}><Grid container spacing = {1}>
                {this.state.colors.map(color => {
                    if(color === this.state.selected) return <Grid item key = {color}><Paper variant = "outlined" style = {{height: "25px", width : "25px", backgroundColor : color, display: 'inline', float: "left", cursor: 'pointer', border: "2px solid black"}} onClick = {() => this.selectColor(color)} /></Grid>
                    else return <Grid item key = {color}><Paper variant = "outlined" style = {{height: "25px", width : "25px", backgroundColor : color, display: 'inline', float: "left", cursor: 'pointer'}} onClick = {() => this.selectColor(color)} /></Grid>
                })}
            </Grid></Paper>
            :
            null
        )
    }
}

export default ColorPicker
