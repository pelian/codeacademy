import { Component } from 'react';

export class Base extends Component {
  _bind(...methods) {
    methods.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }
}