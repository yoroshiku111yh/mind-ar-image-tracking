/**
 * Created by CLIMAX PRODUCTION on 1/17/2019.
 */
const JsDropdown = function(){
    this.selectBox = '';
    this.option = {
        selector : '._js-dropdown',
        hiddenMb : true,
        ar : 'js-ar',
        arClassStyle : '',
        fnReturnResult : 'resultDropDown',
    }
    this.className = {
        'hiddenMb' : 'hidden-xs',
        wrapper : '_js-dropdown__wrapper',
        result : '_js-dropdown__result',
        list : '_js-dropdown__list',
        text_result : '_text',
        li : '', // mutil class 'class1 class2'
        ul : '',
    }
    this.opt = function(opt){
        this.option = Object.assign(this.option, opt);
    }
    this.setClass = function(classList){
        this.className = Object.assign(this.className, classList);
    }
    this.init = function(){
        this.generatorLoop();
        this.clickOutSideToClose();
    }
    this.reinit = function(idWrapper, objData){
        var wrap = document.getElementById(idWrapper);
        var selectBox = wrap.querySelector('select');
        var className =selectBox.getAttribute('class');
        this.removeAll(wrap);
        this.newSelectBox(objData, className, wrap);
        this.generator(wrap);
    }
    this.getSelector = function(){
        var selector = this.option['selector'];
        var wrap = document.querySelectorAll(selector);
        return wrap;
    }
    this.generator = function(wrap){
        var wrapper_all = this.make_wrapper(wrap);
        this.make_result(wrapper_all);
        this.make_option(wrapper_all);
        this.setResult(wrap);
        this.setOptionSelect(wrap);
    }
    this.generatorLoop = function(){
        var wrap_ar = this.getSelector();
        for(var i = 0 ; i < wrap_ar.length; i++){
            var wrap = wrap_ar[i];
            this.generator(wrap);
        }
    }
    this.setResult = function(parent){
        var text_class = '.' + this.className['text_result'];
        var text_block = parent.querySelector(text_class);
        var select = parent.querySelector('select');
        var value = select.options[select.selectedIndex].value;
        var text = select.options[select.selectedIndex].text;
        text_block.setAttribute('value', value);
        text_block.innerHTML = text;
    }
    this.setOptionSelect = function(parent){
        var select = parent.querySelector('select');
        var options = select.querySelectorAll('option');
        var ul = document.createElement('ul');
        var ul_class = this.className['ul'];
        /* handle onChange*/
        this.attachOnChangeSelect(select,function(e){
            var _this = e.currentTarget;
            var parent = _this.parentNode;
            var value = _this.options[_this.selectedIndex].value;
            var text = _this.options[_this.selectedIndex].text;
            var result = {
                value : value,
                text : text,
            }
            this.getResult(result, parent);
        }.bind(this));
        /**/
        if(ul_class !== ''){
            ul.className = ul_class;
        }
        var class_wrap = '.' + this.className['list'];
        var wrap = parent.querySelector(class_wrap);
        wrap.appendChild(ul);
        for(var i = 0 ; i < options.length; i++){
            var opt = options[i];
            var value = opt.value;
            var text = opt.innerHTML;
            if(value !== ''){
                this.make_li(ul ,value, text);
            }
        }
    }
    this.make_li = function(wrap, val, text){
        var li = document.createElement('li');
        var li_class = this.className['li'];
        if(li_class !== ''){
            li.classname = li;
        }
        li.setAttribute('value', val);
        li.innerHTML = text;
        /**/
        this.attachEventClick(li, this.eventClickOption.bind(this));
        /**/
        wrap.appendChild(li);
    }
    this.eventClickOption = function(event){
        var _this = event.currentTarget;
        var value = _this.getAttribute('value');
        var text = _this.innerHTML;
        var wrapper = _this.parentNode.parentNode.parentNode;
        var parent = wrapper.parentNode;
        this.updateResult(value, text, _this);
        var result = {
            value : value,
            text : text,
        }
        this.toggleDropdown(wrapper);
        this.getResult(result, parent);
    }
    this.eventToggleDropDown = function(event){
        var _this = event.currentTarget;
        var parent = _this.parentNode;
        var isActive = this.hasClass(parent, 'active');
        /**/
        let wrapper = '.' + this.className['wrapper'];
        let targets = document.querySelectorAll(wrapper);
        for(var j = 0 ; j < targets.length; j++){
            targets[j].classList.remove('active');
        }
        /**/
        if(!isActive)
            this.toggleDropdown(parent);
    }
    this.toggleDropdown = function(elm){
        if(!this.hasClass(elm, 'active')){
            elm.classList.add('active');
        }
        else{
            elm.classList.remove('active');
        }
    }
    this.updateResult = function(val, text, elm){
        var class_text_result = '.' + this.className['text_result'];
        var class_result_block = '.' + this.className['result'];
        var parent = elm.parentNode.parentNode.parentNode;
        var result_block = parent.querySelector(class_result_block);
        var text_result_block = result_block.querySelector(class_text_result);
        text_result_block.innerHTML = text;
        text_result_block.setAttribute('value', val);
    }
    this.make_wrapper = function(wrap){
        var wrapper_all_class = this.className['wrapper'];
        /**/
        var wrapper_all = document.createElement('div');
        /**/
        var hiddenMb = this.className['hiddenMb'];
        if(this.option['hiddenMb']){
            wrapper_all.classList.add(wrapper_all_class, hiddenMb);
        }
        else{
            wrapper_all.classList.add(wrapper_all_class);
        }
        /**/
        wrap.appendChild(wrapper_all);
        return wrapper_all;
    }
    this.make_result = function(wrap){
        var result_class = this.className['result'];
        var result_text_class = this.className['text_result'];
        /**/
        var result_block = document.createElement('div');
        var result_block_text = document.createElement('span');
        /**/
        result_block.classList.add(result_class);
        result_block_text.classList.add(result_text_class);
        /**/
        result_block.appendChild(result_block_text);
        result_block.appendChild(this.make_ar());
        this.attachEventClick(result_block, this.eventToggleDropDown.bind(this));
        wrap.appendChild(result_block);
    }
    this.make_option = function(wrap){
        var list_class = this.className['list'];
        /**/
        var listOpt = document.createElement('div');
        listOpt.classList.add(list_class);
        /**/
        wrap.appendChild(listOpt);
    }
    this.make_ar = function(){
        var class_ar = this.option['arClassStyle'];
        var ar = this.option['ar'];
        var className = ar + ' ' + class_ar;
        var i = document.createElement('i');
        i.className = className;
        return i;
    }
    this.attachEventClick = function(elm, callback){
        elm.addEventListener("click", callback);
    }
    this.hasClass = function(element, className){
        return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
    }
    this.clickOutSideToClose = function(){
        document.addEventListener("click", (e) => {
            let wrapper = '.' + this.className['wrapper'];
            let _this = e.target;
            let isHave = false;
            let targets = document.querySelectorAll(wrapper);
            for(let i = 0; i < targets.length; i++){
                if(targets[i].contains(_this)){
                    isHave = true;
                    break;
                }
            }
            if(!isHave){
                for(var j = 0 ; j < targets.length; j++){
                    targets[j].classList.remove('active');
                }
            }
        });
    }
    this.attachOnChangeSelect = function(elm, callback){
        elm.addEventListener("change", callback);
    }
    this.getResult = function(result, parent){
        var input = parent.querySelector('input');
        input.value = result.value;
        input.setAttribute('text-value', result.text);
    }
    this.newSelectBox = function(objData, classNameSelectBox, parent){
        var selectBox = document.createElement('select');
        selectBox.setAttribute('class', classNameSelectBox);
        for(var i = 0 ; i < objData.length ; i++){
            var option = document.createElement('option');
            option.value = objData[i].value;
            option.innerHTML = objData[i].text;
            selectBox.appendChild(option);
        }
        parent.appendChild(selectBox);
    }
    this.removeAll = function(wrap){
        var class_wrap = this.className.wrapper;
        this.removeByTagName(wrap, 'select');
        this.removeByClassName(wrap, class_wrap);
    }
    this.removeByTagName = function(parent, tagName){
        var elements = parent.getElementsByTagName(tagName)
        while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    }
    this.removeByClassName = function(parent, className){
        var elements = parent.getElementsByClassName(className);
        while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    }
}
/*muốn update gì thêm hãy xài prototype*/
/*ví dụ*/
JsDropdown.prototype.dogSay = function(){
    console.log('Woof Woof');
}
/**/
/*Polyfill onChange event update by js*/
var valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
HTMLInputElement.prototype.addInputChangedByJsListener = function(cb) {
    if(!this.hasOwnProperty("_inputChangedByJSListeners")) {
        this._inputChangedByJSListeners = [];
    }
    this._inputChangedByJSListeners.push(cb);
}

Object.defineProperty(HTMLInputElement.prototype, "value", {
    get: function() {
        return valueDescriptor.get.apply(this, arguments);
    },
    set: function() {
        var self = this;
        valueDescriptor.set.apply(self, arguments);
        if(this.hasOwnProperty("_inputChangedByJSListeners")){
            this._inputChangedByJSListeners.forEach(function(cb) {
                cb.apply(self);
            })
        }
    }
});
/** example
 document.getElementById("myInput").addInputChangedByJsListener(function() {
    console.log("Input changed to \"" + this.value + "\"");
});
 **/
/**/
export default JsDropdown;