/*
 * @Author: Ping Qixing
 * @Date: 2017-08-21 11:36:07
 * @Last Modified by: Ping Qixing
 * @Last Modified time: 2017-08-21 18:44:22
 * @Description: a fake React implemention
 */
// 创建单个元素的辅助类
class FeactDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type);
    const textNode = document.createTextNode(this._currentElement.props.children);

    domElement.appendChild(textNode);
    container.appendChild(domElement);

    this._hostNode = domElement;
    return domElement;
  }
}

// 创建组合组件的辅助类
class FeactCompositeComponentWrapper {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const Component = this._currentElement.type;
    const componentInstance = new Component(this._currentElement.props);
    let element = componentInstance.render();

    // 这里先暂时使用循环来检查 element 的类型
    while (typeof element.type === 'function') {
      element = (new element.type(element.props)).render();
    }

    const domComponentInstance = new FeactDOMComponent(element);
    return domComponentInstance.mountComponent(container);
  }
}

// 简单的 组合组件
class TopLevelWrapper {
  constructor(props) {
    this.props = props;
  }

  render() {
    return this.props;
  }
}

const Feact = {
  createElement(type, props, children) {
    const element = {
      type,
      props: props || {}
    };

    if (children) {
      element.props.children = children;
    }

    return element;
  },

  createClass(spec) {
    function Constructor(props) {
      this.props = props;
    }

    Constructor.prototype.render = spec.render;
    return Constructor;
  },

  // 与 createClass使用有点问题，因此先注释掉
  // render(element, container) {
  //   const componentInstance = new FeactDOMComponent(element);
  //   return componentInstance.mountComponent(container);
  // }

  render(element, container) {
    // 此处应该判断 element 是 原生的DOM元素还是 组合组件。
    // 如果是 原生的DOM元素，可以用上面的 render 方法；
    // 如果是 组合组件，就用下面的这个辅助类
    console.log('Composite');

    // 使用 wrapper 组件
    const wrapperElement = this.createElement(TopLevelWrapper, element);
    const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
    return componentInstance.mountComponent(container);
  }
};

export default Feact;
