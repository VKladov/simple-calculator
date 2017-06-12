var c;
$(document).ready(function(){
    c = new Calculator(document.getElementById('my-calculator'));
});

function Calculator(el){
    
    this.el = el;
    this._init();
};
Calculator.prototype._init = function(){
    this.input = this.el.querySelector('input.calc__input');
    this.btnsNum = this.el.querySelectorAll('.btn[data-type="symbol"]');
    this.btnsAction = this.el.querySelectorAll('.btn[data-type="action"]');
    this.resultBtn = this.el.querySelector('.calc-result-btn');
    this.caretPosition = {start: 0, end: 0};
    this.charts = '0123456789e/*()+-,';
    
    this._initEvents();
};
Calculator.prototype._initEvents = function(){
    var _this = this;
    
    $(this.btnsNum).on('click', function(){
        var value = $(this).text();
        _this._addSymbol(value);
    });
    
    $(this.input).on('blur', function(){
        _this.caretPosition = _this._getCaretPosition();
    });
    
    $(this.input).on('keypress', function(e){
        if(e.keyCode === 13){
            _this._resultAction();
        }
        if(_this.charts.indexOf(e.key) == -1){
            e.preventDefault();
        }
    });
    
    $(this.btnsAction).on('click', function(){
        var action = $(this).text();
        _this._addAction(action);
    });
    
    $(this.resultBtn).on('click', function(){
        _this._resultAction();
    });
    
    $(this.input).on('focus', function(){
        _this._setCaretPosition(_this.input.value.length, _this.input.value.length);
    });
};
Calculator.prototype._addSymbol = function(value){
    var position = this.caretPosition,
        start = position.start,
        end = position.end,
        oldValue = this.input.value;
    
    
    
    this.input.value = oldValue.substr(0, start) + value + oldValue.substr(end, oldValue.length - start);
    
    this.input.focus();
    
    this._setCaretPosition(position.start + 1, position.start + 1);
    
    
};
Calculator.prototype._addAction = function(a){
    var action;
    switch (a) {
        case 'CE':
            this._clearInput();
            break;
        case 'C':
            this._deleteSymbol();
            break;
    }
    
};
Calculator.prototype._clearInput = function() {
    this.input.value = '';
};
Calculator.prototype._deleteSymbol = function() {
    var position = this.caretPosition,
        start = position.start,
        end = position.end,
        oldValue = this.input.value;
    
    if (this._getCaretPosition().start === this.input.value.length) {
        
        this.input.value = this.input.value.substr(0, this.input.value.length - 1);
        
    } else {
        if (start === end) {
            this.input.value = oldValue.substr(0, start - 1) + oldValue.substr(end, oldValue.length - start);
            this._setCaretPosition(position.start - 1, position.start - 1);
        } else {
            this.input.value = oldValue.substr(0, start) + oldValue.substr(end, oldValue.length - start);
            this._setCaretPosition(position.start, position.start);
        }
        
        
    }
    
    this.input.focus();
    
};
Calculator.prototype._getCaretPosition = function() {
    var ctrl = this.input;
    
	if (document.selection) {
		ctrl.focus();
		var range = document.selection.createRange();
		var rangelen = range.text.length;
		range.moveStart ('character', -ctrl.value.length);
		var start = range.text.length - rangelen;
		return {'start': start, 'end': start + rangelen };
	}
	else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
	} else {
		return {'start': 0, 'end': 0};
	}
};
Calculator.prototype._setCaretPosition = function(start, end) {
	var ctrl = this.input;
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(start, end);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', end);
		range.moveStart('character', start);
		range.select();
	}
};
Calculator.prototype._resultAction = function(){
    var value = this.input.value + '',
        _this = this,
        result;
    
    result = calculate(value);
    if (result) {
        this.input.value = result;
        $(this.input).addClass('success');
        setTimeout(function(){ $(_this.input).removeClass('success'); }, 500);
        
        this.caretPosition = {start: result.length, end: result.length};
        this._setCaretPosition(result.length, result.length);
    }else{
        $(this.input).addClass('error');
        setTimeout(function(){ $(_this.input).removeClass('error'); }, 500);
    }
    
};

function calculate(string){
    var result;
    
    string = string.replace(',','.');
    
    try{ 
        result = eval(string);
    }catch(err){
        return false;
    }
    
    
    result = result.toString().replace('.', ',');
    
    return result;
};