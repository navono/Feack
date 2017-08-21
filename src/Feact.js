/*
 * @Author: Ping Qixing
 * @Date: 2017-08-21 11:36:07
 * @Last Modified by: Ping Qixing
 * @Last Modified time: 2017-08-21 20:55:47
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

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
  }

  updateComponent(prevElement, nextElement) {
    const lastProps = prevElement.props;
    const nextProps = nextElement.props;

    this._updateDOMProperties(lastProps, nextProps);
    this._updateDOMChildren(lastProps, nextProps);

    this._currentElement = nextElement;
  }

  _updateDOMProperties(lastProps, nextProps) {
    // mostly update CSS styles
  }

  _updateDOMChildren(lastProps, nextProps) {
    // 实际上的 React 在这里做了很多复杂的逻辑处理。
    // 在此只演示更新 文本
    const lastContent = lastProps.children;
    const nextContent = nextProps.children;

    if (!nextContent) {
      this.updateTextContent('');
    } else if (lastContent !== nextContent) {
      this.updateTextContent('' + nextContent);
    }
  }

  updateTextContent(text) {
    const node = this._hostNode;
    
    const firstChild = node.firstChild;
    
    if (firstChild && firstChild === node.lastChild
        && firstChild.nodeType === 3) {
      firstChild.nodeValue = text;
      return;
    }
    
    node.textContent = text;
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

  receiveComponent(nextElement) {
    const prevElement = this._currentElement;
    this.updateComponent(prevElement, nextElement);
  }

  updateComponent(prevElement, nextElement) {
    const nextProps = nextElement.props;

    this._performComponentUpdate(nextElement, nextProps);
  }

  _performComponentUpdate(nextElement, nextProps) {
    this._currentElement = nextElement;
    const inst = this._instance;
    inst.props = nextProps;

    this._updateRenderedComponent();
  }

  _updateRenderedComponent() {
    const prevComponentInstance = this._renderedComponent;
    const inst = this._instance;
    const nextRenderedElement = inst.render();

    FeactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement)
  }
}

const FeactReconciler = {
  mountComponent(internalInstance, container) {
    return internalInstance.mountComponent(container);
  },

  // 增加转发函数
  receiveComponent(internalInstance, nextElement) {
    internalInstance.receiveComponent(nextElement);
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
    const prevComponent = getTopLevelComponentInContainer(container);
    if (prevComponent) {
      return updateRootComponent(
        prevComponent,
        element
      );
    } else {
      return renderNewRootComponent(element, container);
    }
  }
};

function renderNewRootComponent(element, container) {
  const wrapperElement = Feact.createElement(TopLevelWrapper, element);
  const componentInstance = new FeactCompositeComponentWrapper(wrapperElement);

  const markUp = FeactReconciler.mountComponent(
    componentInstance,
    container
  );

  // new line here, store the component instance on the container
  // we want its _renderedComponent because componentInstance is just
  // the TopLevelWrapper, which we don't need for updates
  container.__feactComponentInstance = componentInstance._renderedComponent;

  return markUp;
}

function getTopLevelComponentInContainer(container) {
  return container.__feactComponentInstance;
}

function updateRootComponent(prevComponent, nextElement) {
  FeactReconciler.receiveComponent(prevComponent, nextElement);
}

export default Feact;
