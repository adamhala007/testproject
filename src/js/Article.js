import React, { Component } from 'react';
import '../css/Article.css';


class Article extends Component{
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            text: props.text
        }
    }

    render(){
        return(
            <article>
                <h2>{this.state.title}</h2>
                <p>{this.state.text}</p>
            </article>
        )
    }
}

export default Article;