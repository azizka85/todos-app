(function () {
  'use strict';

  class TodosGlobals {  
    static todosClassName = 'todos';
    static todosDataName = 'data-todos';

    /* ---------------- Todos header ------------------ */
    static get todosHeaderClassName() {
      return this.todosClassName + '-header';
    }

    static get todosHeaderDataName() {
      return this.todosDataName + '-header';
    }


    /* ---------------- TodosList ------------------ */
    static get todosListClassName() {
      return this.todosClassName + '-list';
    }

    static get todosListDataName() {
      return this.todosDataName + '-list';
    }

    /* ---------------- TodosListHeader ------------------ */
    static get todosListHeaderClassName() {
      return this.todosListClassName + '-header';
    }

    static get todosListHeaderDataName() {
      return this.todosListDataName + '-header';
    }

    static get todosListHeaderInputDataName() {
      return this.todosListHeaderDataName + '-input';
    }

    static get todosListHeaderExpanderDownIconDataName() {
      return this.todosListHeaderDataName + '-expander-down-icon';
    }

    static get todosListHeaderExpanderRightIconDataName() {
      return this.todosListHeaderDataName + '-expander-right-icon';
    }


    /* ---------------- TodosListFooter ------------------ */
    static get todosListFooterClassName() {
      return this.todosListClassName + '-footer';
    }

    static get todosListFooterContainerClassName() {
      return this.todosListFooterClassName + '-container';
    }

    static get todosListFooterButtonsClassName() {
      return this.todosListFooterClassName + '-buttons';
    }

    static get todosListFooterButtonClassName() {
      return this.todosListFooterClassName + '-button';
    }

    static get todosListFooterButtonActiveClassName() {
      return this.todosListFooterButtonClassName + '-active';
    }

    static get todosListFooterDataName() {
      return this.todosListDataName + '-footer';
    }

    static get todosListFooterContainerDataName() {
      return this.todosListFooterDataName + '-container';
    }

    static get todosListFooterDisplayAllButtonDataName() {
      return this.todosListFooterDataName + '-btn-all';
    }

    static get todosListFooterDisplayActiveButtonDataName() {
      return this.todosListFooterDataName + '-btn-active';
    }

    static get todosListFooterDisplayCompletedButtonDataName() {
      return this.todosListFooterDataName + '-btn-completed';
    }

    static get todosListFooterClearCompletedButtonDataName() {
      return this.todosListFooterDataName + '-btn-clear-completed';
    }


    /* ---------------- TodoItem ------------------ */
    static get todoItemClassName() {
      return this.todosListClassName + '-item';
    }

    static get todoItemCheckedClassName() {
      return this.todoItemClassName + '-checked';
    }

    static get todoItemDataName() {
      return this.todosListDataName + '-item';
    }

    static get todoItemTemplateDataName() {
      return this.todoItemDataName + '-template';
    }

    static get todoItemContainerDataName() {
      return this.todoItemDataName + '-container';
    }

    static get todoItemCheckboxDataName() {
      return this.todoItemDataName + '-checkbox';
    }
  }

  class TodosBase {
    _component;

    constructor(elem, tagName, className) {
      if(!elem) {
        this._component = this._createComponent(tagName, className);
      } else {
        this._component = elem;
      }
    }

    _createComponent(tagName, className) {
      const elem = document.createElement(tagName);
      elem.classList.add(className);

      return elem;
    }

    get component() {
      return this._component;
    }
  }

  class TodoItem extends TodosBase {
    _container = null;
    _checkbox = null;

    constructor(elem, props) {
      super(elem, 'li', TodosGlobals.todoItemClassName);

      if(!elem) {
        this._checkbox = this._createCheckbox();
        this._container = this._createContainer();
      } else {
        this._checkbox = elem.querySelector(`[${TodosGlobals.todoItemCheckboxDataName}]`);
        this._container = elem.querySelector(`[${TodosGlobals.todoItemContainerDataName}]`);     
      }

      if(this._checkbox) {
        this._checkbox.checked = props?.completed ?? false;
        this._checkbox.addEventListener('change', () => props?.onTodoStatusChange?.(this));
      }

      if(this._container) {
        if(props?.title) {
          this._container.textContent = props?.title;
        }
      }
    }

    get container() {
      return this._container;
    }

    get checkbox() {
      return this._checkbox;
    }

    _createContainer() {
      const elem = document.createElement('span');

      this.component.appendChild(elem);

      return elem;
    }

    _createCheckbox() {
      const labelElem = document.createElement('label');
      const checkbox = document.createElement('input');    
      const spanElem = document.createElement('span');

      checkbox.type = 'checkbox';

      spanElem.innerHTML = `
      <svg viewBox="0 0 16 16">
        <path 
          d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"
        />
      </svg>
    `;

      labelElem.appendChild(checkbox);
      labelElem.appendChild(spanElem);

      this.component.appendChild(labelElem);

      return checkbox;
    }

    static init(todosListElem, props) {
      const elems = todosListElem.querySelectorAll(`[${TodosGlobals.todoItemDataName}]`);

      const items = [];

      for(let elem of elems) {
        const item = new TodoItem(elem, props);

        items.push(item);
      }

      return items;
    }
  }

  class TodosListHeader extends TodosBase {
    _iconRight = null;
    _iconDown = null;
    _input = null;

    _display = true;

    _props = null;

    constructor(elem, props) {
      super(elem, 'li', TodosGlobals.todosListHeaderClassName);

      this._props = props;

      if(!elem) {
        this._createIcons();
        this._createInput();
      } else {
        this._iconDown = elem.querySelector(`[${TodosGlobals.todosListHeaderExpanderDownIconDataName}]`);
        this._iconRight = elem.querySelector(`[${TodosGlobals.todosListHeaderExpanderRightIconDataName}]`);
        this._input = elem.querySelector(`[${TodosGlobals.todosListHeaderInputDataName}]`);
      }

      if(this._iconRight) {
        this._iconRight.addEventListener('click', () => this.display = true);
      }

      if(this._iconDown) {
        this._iconDown.addEventListener('click', () => this.display = false);
      }

      if(this._input) {
        this._input.addEventListener('keyup', (event) => {
          const title = event.target.value.trim();

          if(event.key === 'Enter' && title) {
            props?.onCreateTodo?.(title);

            event.target.value = '';
          }
        });
      }

      this._changeDisplay();
    }

    get display() {
      return this._display;
    }

    set display(value) {
      if(this._display !== value) {
        this._display = value;

        this._changeDisplay();

        this._props?.onDisplayChanged?.();
      }
    }

    get iconRight() {
      return this._iconRight;
    }

    get iconDown() {
      return this._iconDown;
    }

    get input() {
      return this._input;
    }

    _createIcons() {
      const spanElem = document.createElement('span');

      spanElem.innerHTML = `
      <svg viewBox="0 0 16 16" ${TodosGlobals.todosListHeaderExpanderDownIconDataName}>
        <path
          fillRule="evenodd"
          d="
            M1.646 4.646a.5.5 0 0 1 .708 0L8 
            10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 
            6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z
          "
        />
      </svg>
      <svg viewBox="0 0 16 16" ${TodosGlobals.todosListHeaderExpanderRightIconDataName}>
        <path
          fillRule="evenodd"
          d="
            M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 
            .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 
            2.354a.5.5 0 0 1 0-.708z
          "
        />
      </svg>
    `;

      this._iconDown = spanElem.querySelector(`[${TodosGlobals.todosListHeaderExpanderDownIconDataName}]`);
      this._iconRight = spanElem.querySelector(`[${TodosGlobals.todosListHeaderExpanderRightIconDataName}]`);

      this.component.appendChild(spanElem);
    }

    _createInput() {
      this._input = document.createElement('input');

      this._input.placeholder = 'What needs to be done?';

      this.component.appendChild(this._input);
    }

    _changeDisplay() {
      if(this._iconRight) {
        this._iconRight.style.display = this._display ? 'none' : '';
      }
      if(this._iconDown) {
        this._iconDown.style.display = !this._display ? 'none' : '';
      }
    }

    static init(todosListElem, props) {
      const elem = todosListElem.querySelector(`[${TodosGlobals.todosListHeaderDataName}]`);

      if(elem) {
        return new TodosListHeader(elem, props);
      } else {
        return null;
      }    
    }
  }

  const TodosListDisplayMode = {
    All: 'all', 
    Active: 'active',
    Completed: 'completed'
  };

  class TodosListFooter extends TodosBase {
    _container = null;
    _displayAllBtn = null;
    _displayActiveBtn = null;
    _displayCompletedBtn = null;
    _clearCompletedBtn = null;
    
    constructor(elem, props) {
      super(elem, 'li', TodosGlobals.todosListFooterClassName);    

      if(!elem) {
        this._createContainer();
        this._createButtons();
        this._createClearCompletedBtn();
      } else {
        this._container = elem.querySelector(`[${TodosGlobals.todosListFooterContainerDataName}]`);
        this._displayAllBtn = elem.querySelector(`[${TodosGlobals.todosListFooterDisplayAllButtonDataName}]`);
        this._displayActiveBtn = elem.querySelector(`[${TodosGlobals.todosListFooterDisplayActiveButtonDataName}]`);
        this._displayCompletedBtn = elem.querySelector(`[${TodosGlobals.todosListFooterDisplayCompletedButtonDataName}]`);
        this._clearCompletedBtn = elem.querySelector(`[${TodosGlobals.todosListFooterClearCompletedButtonDataName}]`);
      }

      if(this._displayAllBtn) {
        this._displayAllBtn.addEventListener('click', () => props?.onChangeDisplayMode?.(TodosListDisplayMode.All));
      }
      if(this._displayActiveBtn) {
        this._displayActiveBtn.addEventListener('click', () => props?.onChangeDisplayMode?.(TodosListDisplayMode.Active));
      }
      if(this._displayCompletedBtn) {
        this._displayCompletedBtn.addEventListener('click', () => props?.onChangeDisplayMode?.(TodosListDisplayMode.Completed));
      }
      if(this._clearCompletedBtn) {
        this._clearCompletedBtn.addEventListener('click', () => props?.onClearCompleted?.());
      }
    }

    get container() {
      return this._container;
    }

    get displayAllBtn() {
      return this._displayAllBtn;
    }

    get displayActiveBtn() {
      return this._displayActiveBtn;
    }

    get displayCompletedBtn() {
      return this._displayCompletedBtn;
    }

    get clearCompletedBtn() {
      return this._clearCompletedBtn;
    }

    _createContainer() {
      const elem = document.createElement('div');
      elem.classList.add(TodosGlobals.todosListFooterContainerClassName);
      elem.innerHTML = `<span ${TodosGlobals.todosListFooterContainerDataName}></span> items left`;

      this._container = elem.querySelector(`[${TodosGlobals.todosListFooterContainerDataName}]`);

      this.component.appendChild(elem);
    }

    _createButtons() {
      const elem = document.createElement('div');
      elem.classList.add(TodosGlobals.todosListFooterButtonsClassName);

      this._displayAllBtn = document.createElement('div');
      this._displayAllBtn.classList.add(TodosGlobals.todosListFooterButtonClassName);
      this._displayAllBtn.textContent = 'All'; 
      
      this._displayActiveBtn = document.createElement('div');
      this._displayActiveBtn.classList.add(TodosGlobals.todosListFooterButtonClassName);
      this._displayActiveBtn.textContent = 'Active';

      this._displayCompletedBtn = document.createElement('div');
      this._displayCompletedBtn.classList.add(TodosGlobals.todosListFooterButtonClassName);
      this._displayCompletedBtn.textContent = 'Completed';

      elem.appendChild(this._displayAllBtn);
      elem.appendChild(this._displayActiveBtn);
      elem.appendChild(this._displayCompletedBtn);

      this.component.appendChild(elem);
    }

    _createClearCompletedBtn() {
      this._clearCompletedBtn = document.createElement('div');
      this._clearCompletedBtn.classList.add(TodosGlobals.todosListFooterButtonClassName);
      this._clearCompletedBtn.classList.add(TodosGlobals.todosListFooterButtonActiveClassName);
      this._clearCompletedBtn.textContent = 'Clear completed';

      this.component.appendChild(this._clearCompletedBtn);
    }

    static init(todosListElem, props) {
      const elem = todosListElem.querySelector(`[${TodosGlobals.todosListFooterDataName}]`);

      if(elem) {
        return new TodosListFooter(elem, props);
      } else {
        return null;
      }    
    }
  }

  class TodosList extends TodosBase {
    _header = null;
    _footer = null;  
    _itemTemplate = null;

    _mode = null;
    _props = null;

    _items = [];

    constructor(elem, props) {
      super(elem, 'ul', TodosGlobals.todosListClassName);

      this._props = props;

      const headerProps = {
        onDisplayChanged: this._changeListDisplay.bind(this),
        onCreateTodo: (title) => this.addItem(title, false)
      };

      const footerProps = {
        onChangeDisplayMode: this.changeDisplayMode.bind(this),
        onClearCompleted: this.clearCompleted.bind(this)
      };

      const itemProps = {
        onTodoStatusChange: this._todoStatusChanged.bind(this)
      };

      if(!elem) {
        this._createHeader(headerProps);
        this._createFooter(footerProps);
      } else {
        this._header = TodosListHeader.init(elem, headerProps);
        this._footer = TodosListFooter.init(elem, footerProps);
        this._items = TodoItem.init(elem, itemProps);

        this._itemTemplate = document
          .querySelector(`[${TodosGlobals.todoItemTemplateDataName}]`)
          ?.content;

        if(!this._itemTemplate && this._items.length > 0) {
          this._itemTemplate = this._items[0].component.cloneNode(true);
        }
      }

      this._changeListDisplay();
      this._changeFooterContent();   
      this.changeDisplayMode(TodosListDisplayMode.All); 
    }

    get props() {
      return this._props;
    }

    get mode() {
      return this._mode;
    }

    get header() {
      return this._header;
    }

    get footer() {
      return this._footer;
    }

    get itemTemplate() {
      return this._itemTemplate;
    }

    get items() {
      return this._items;
    }

    addItem(title, completed) {
      const itemProps = {
        title,
        completed,
        onTodoStatusChange: this._todoStatusChanged.bind(this)
      };

      const elem = this._itemTemplate?.cloneNode?.(true);

      const item = new TodoItem(elem, itemProps);

      this._addTodoItemComponent(item);
      this._changeItemDisplayMode(item);

      this._items.push(item);

      this._changeFooterContent();
      this._props?.onDataChanged?.();

      return item;
    }

    removeItems(items) {
      this._removeItems(items, true);

      this._changeFooterContent();

      this._props?.onDataChanged?.();
    }

    changeDisplayMode(mode) {
      if(this._mode !== mode) {
        this._mode = mode;

        for(let item of this._items) {
          this._changeItemDisplayMode(item);
        }
      }

      if(this._footer) {
        if(this._footer.displayAllBtn) {
          if(this._mode === TodosListDisplayMode.All) {
            this._footer.displayAllBtn.classList?.add?.(TodosGlobals.todosListFooterButtonActiveClassName);
          } else {
            this._footer.displayAllBtn.classList?.remove?.(TodosGlobals.todosListFooterButtonActiveClassName);
          }
        }

        if(this._footer.displayActiveBtn) {
          if(this._mode === TodosListDisplayMode.Active) {
            this._footer.displayActiveBtn.classList?.add?.(TodosGlobals.todosListFooterButtonActiveClassName);
          } else {
            this._footer.displayActiveBtn.classList?.remove?.(TodosGlobals.todosListFooterButtonActiveClassName);
          }
        }

        if(this._footer.displayCompletedBtn) {
          if(this._mode === TodosListDisplayMode.Completed) {
            this._footer.displayCompletedBtn.classList?.add?.(TodosGlobals.todosListFooterButtonActiveClassName);
          } else {
            this._footer.displayCompletedBtn.classList?.remove?.(TodosGlobals.todosListFooterButtonActiveClassName);
          }
        }
      }
    }

    clearCompleted() {
      const items = [];

      for(let item of this._items) {
        if(item.checkbox?.checked) {
          items.push(item);
        }
      }

      this.removeItems(items);
    }

    _removeItems(items, fromArray) {
      for(let item of items) {
        const index = this._items.indexOf(item);
        if(index >= 0) {
          this.component.removeChild(item.component);
          if(fromArray) this._items.splice(index, 1);        
        }
      }
    }

    _addTodoItemComponent(item) {
      if(this._footer) {
        this.component.insertBefore(item.component, this._footer.component);
      } else {
        this.component.appendChild(item.component);
      }    
    }

    _createHeader(props) {
      this._header = new TodosListHeader(null, props);

      this.component.appendChild(this._header.component);
    }

    _createFooter(props) {
      this._footer = new TodosListFooter(null, props);

      this.component.appendChild(this._footer.component);
    }
    
    _changeListDisplay() {
      if(this._header?.display ?? true) {
        for(let item of this._items) {
          this._addTodoItemComponent(item);
        }
      } else {
        this._removeItems(this._items, false);
      }
    }  

    _changeFooterContent() {
      if(this._footer && this._footer.container) {
        this._footer.container.textContent = this._items.length;
      }
    }

    _changeItemDisplayMode(item) {
      item.component.style.display = 
        this._mode === TodosListDisplayMode.All 
          || (this._mode === TodosListDisplayMode.Completed && item.checkbox?.checked)
          || (this._mode === TodosListDisplayMode.Active && !item.checkbox?.checked)
        ? ''
        : 'none';

      if(item.checkbox?.checked) {    
        item.component.classList.add(TodosGlobals.todoItemCheckedClassName);
      } else {
        item.component.classList.remove(TodosGlobals.todoItemCheckedClassName);
      }      
    }

    _todoStatusChanged(item) {
      this._changeItemDisplayMode(item); 

      this._props?.onDataChanged?.();
    }

    static init(todosElem, props) {
      const elem = todosElem.querySelector(`[${TodosGlobals.todosListDataName}]`);

      if(elem) {
        return new TodosList(elem, props);
      } else {
        return null;
      }    
    }
  }

  class Todos extends TodosBase {  
    _header = null;
    _list = null;

    constructor(elem, props) {
      super(elem, 'div', TodosGlobals.todosClassName);

      if(!elem) {
        this._createHeader();
        this._createList(props);
      } else {
        this._header = elem.querySelector(`[${TodosGlobals.todosHeaderDataName}]`);
        this._list = TodosList.init(elem, props);
      }
    }

    get header() {
      return this._header;
    }

    get list() {
      return this._list;
    }

    _createHeader() {
      this._header = document.createElement('div');
      this._header.classList.add(TodosGlobals.todosHeaderClassName);

      this._header.textContent = 'todos';

      this.component.appendChild(this._header);
    }

    _createList(props) {
      this._list = new TodosList(null, props);

      this.component.appendChild(this._list.component);
    }

    static init(props) {
      const elems = document.querySelectorAll(`[${TodosGlobals.todosDataName}]`);

      const todosRoots = [];

      for(let elem of elems) {
        const todos = new Todos(elem, props);

        todosRoots.push(todos);
      }

      return todosRoots;
    }
  }

  var TodosModule = /*#__PURE__*/Object.freeze({
    __proto__: null,
    TodosGlobals: TodosGlobals,
    TodosBase: TodosBase,
    Todos: Todos,
    TodosList: TodosList,
    TodosListFooter: TodosListFooter,
    TodoItem: TodoItem
  });

  if(window) { 
    window.TodosModule = TodosModule;
  }

})();
//# sourceMappingURL=todos-0.9.4.js.map
