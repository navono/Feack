import Feact from './Feact';

// 在创建自定义的 组件类 时，需要预先定义好这个 组件类 中的元素，
// 也就是自定义 render 方法。在 render 方法里创建 元素


const MyH1 = Feact.createClass({
  render() {
    return Feact.createElement('h1', null, this.props.msg);
  }
});

const MyMessage = Feact.createClass({
  componentWillMount() {
    console.log('componentWillMount');
  },

  componentDidMount() {
    console.log('componentDidMount');
  },

  render() {
    // 此时这里如果返回一个 组合组件，那么 FeactCompositeComponentWrapper 里
    // 需要相应修改
    if (this.props.asTitle) {
      return Feact.createElement(
        MyH1, 
        {
          msg: this.props.msg
        });
    } else {
      return Feact.createElement('p', null, this.props.msg);
    }
  }
});

const MyComponent = Feact.createClass({
  getInitialState() {
    return {
      msg: 'calling setState in two seconds'
    }
  },

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        msg: 'setState called'
      })
    }, 2000);
  },

  render() {
    return Feact.createElement('h1', null, this.state.msg);
  }
})

export { MyMessage, MyComponent };
