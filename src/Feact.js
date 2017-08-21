/*
 * @Author: Ping Qixing
 * @Date: 2017-08-21 11:36:07
 * @Last Modified by: Ping Qixing
 * @Last Modified time: 2017-08-21 20:17:55
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
    this._instance = componentInstance;

    // render 前调用 componentWillMount
    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount();
    }

    const markup = this.performInitialMount(container);

    // render 后调用 componentDidMount
    if (componentInstance.componentDidMount) {
      componentInstance.componentDidMount();
    }

    return markup;
  }

  performInitialMount(container) {
    const renderedElement = this._instance.render();
    const child = instantiateFeactComponent(renderedElement);
    this._renderedComponent = child;

    return FeactReconciler.mountComponent(child, container);
  }
}

const FeactReconciler = {
  mountComponent(internalInstance, container) {
    return internalInstance.mountComponent(container);
  }
}

// 根据类型，构建相应的组件进行转发
function instantiateFeactComponent(element) {
  if (typeof element.type === 'string') {
    return new FeactDOMComponent(element);
  } else if (typeof element.type === 'function') {
    return new FeactCompositeComponentWrapper(element);
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

    Constructor.prototype = Object.assign(Constructor.prototype, spec);
    return Constructor;
  },

  render(element, container) {
    // 此处应该判断 element 是 原生的DOM元素还是 组合组件。
    // 如果是 原生的DOM元素，可以用上面的 render 方法；
    // 如果是 组合组件，就用下面的这个辅助类

    // 使用 wrapper 组件
    const wrapperElement = this.createElement(TopLevelWrapper, element);
    const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);
    
    return FeactReconciler.mountComponent(
      componentInstance,
      container
    );
  }
};

export default Feact;
