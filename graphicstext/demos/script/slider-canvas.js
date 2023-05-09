
function SliderInfo(info) {
    this.label = null;
    this.showValue = true;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.value = 50;
    this.decimals = null;
    if (info) {
        for (var prop in info) {
            this[prop] = info[prop];
        }
    }
    this.top = null;          // to be set the first time this.draw() is called.
    this.length = null;
    this.tabPosition = null;
}
SliderInfo.prototype.xToValue = function(x) {
    var fract = (x - 15) / this.length;
    if (fract <= 0) {
        return this.min;
    }
    if (fract >= 1) {
        return this.max;
    }
    var val = this.min + fract*(this.max - this.min);
    var steps = Math.round( (val - this.min)/this.step );
    val = this.min + steps*this.step;
    if (val > this.max) {
        val = this.max;
    }
    return val;
}
SliderInfo.prototype.setValue = function(val) {
    if (val >= this.min && val <= this.max) {
        this.value = val;
        this.valueToTabLeft();
    }
}
SliderInfo.prototype.valueToTabLeft = function() {
    var fraction = (this.value - this.min) / (this.max - this.min);
    var pos = Math.round(fraction * this.length);
    this.tabLeft = (pos+15) - 10;
}
SliderInfo.prototype.distanceToTab = function(x,y) {
    var tx = this.tabLeft + 10;
    var ty = this.top + 21;
    var d2 = (x-tx)*(x-tx) + (y-ty)*(y-ty);
    return Math.sqrt(d2);
}
SliderInfo.prototype.hitTab = function(x,y) {
    return (x > this.tabLeft && x < this.tabLeft + 20 && y > this.top + 10 && y < this.top + 32);
}
SliderInfo.prototype.hitBar = function(x,y) {
    return (y > this.top + 30 && y < this.top + 40 && x > 15 && x < 15 + this.length);
}
SliderInfo.prototype.setBar = function(x) {  // returns true/false to say whether value changed
    var val = this.xToValue(x);
    if (x == this.value) {
        return false;
    }
    else {
        this.value = val;
        this.valueToTabLeft();
        return true;
    }
}
SliderInfo.prototype.dragTab = function(newTabLeft) {  // returns true/false to say whether value changed
    var actualTL;
    if (newTabLeft < 5) {
        actualTL = 5;
    }
    else if (newTabLeft > 5+this.length) {
        actualTL = 5+this.length;
    }
    else {
        actualTL = newTabLeft;
    }
    var val = this.xToValue(actualTL + 10);
    if (val == this.value) {
        return false;       
    }
    else {
        this.value = val;
        this.valueToTabLeft();
        return true;
    }
}
SliderInfo.prototype.moveTabToValue = function() {
    var fraction = (this.value - this.min) / (this.max - this.min);
    var size = this.length * fraction;
    this.tabLeft = Math.round(size+15) - 10;
}
SliderInfo.prototype.draw = function(graphics) {

    if (this.top == null) {
        return;  // can't draw yet, position not set
    }
    graphics.beginPath();
    graphics.moveTo(15, this.top + 35);
    graphics.lineTo(15 + this.length, this.top + 35);
    graphics.strokeStyle = "black";
    graphics.lineWidth = 10;
    graphics.lineCap = "round";
    graphics.stroke();
    graphics.strokeStyle = "gray";
    graphics.lineWidth = 7.5;
    graphics.lineCap = "butt";
    graphics.stroke();
    graphics.beginPath();
    graphics.moveTo(15, this.top + 35);
    graphics.lineTo(this.tabLeft + 10, this.top + 35);
    graphics.strokeStyle = "lightgray";
    graphics.stroke();
    graphics.fillStyle = "black";
    graphics.lineWidth = 1;
    if (this.label) {
        graphics.fillText(this.label + " =", this.length + 30, this.top + 27);
    }
    if (this.showValue) {
        if (this.decimals) {
            graphics.fillText("" + Number(this.value).toFixed(this.decimals), this.length + 40, this.top + 43);
        }
        else {
            graphics.fillText("" + this.value, this.length + 40, this.top + 43);
        }
    }
    graphics.beginPath();
    graphics.moveTo(this.tabLeft + 10, this.top + 36);
    graphics.lineTo(this.tabLeft + 20, this.top + 30);
    graphics.lineTo(this.tabLeft + 20, this.top + 10);
    graphics.lineTo(this.tabLeft, this.top + 10);
    graphics.lineTo(this.tabLeft, this.top + 30);
    graphics.closePath();
    graphics.fillStyle = "#9090FF";
    graphics.fill();
    graphics.strokeStyle = "#000099";
    graphics.stroke();
    graphics.beginPath();
    graphics.moveTo(this.tabLeft + 4.5, this.top + 14);
    graphics.lineTo(this.tabLeft + 4.5, this.top + 26);
    graphics.moveTo(this.tabLeft + 9.5, this.top + 14);
    graphics.lineTo(this.tabLeft + 9.5, this.top + 26);
    graphics.moveTo(this.tabLeft + 14.5, this.top + 14);
    graphics.lineTo(this.tabLeft + 14.5, this.top + 26);
    graphics.stroke();
    graphics.beginPath();
    graphics.moveTo(this.tabLeft + 6, this.top + 16);
    graphics.lineTo(this.tabLeft + 6, this.top + 28);
    graphics.moveTo(this.tabLeft + 11, this.top + 16);
    graphics.lineTo(this.tabLeft + 11, this.top + 28);
    graphics.moveTo(this.tabLeft + 16, this.top + 16);
    graphics.lineTo(this.tabLeft + 16, this.top + 28);
    graphics.strokeStyle = "white";
    graphics.stroke();
    graphics.restore();
}


function SliderCanvas(canvas) {
    if (!canvas) {
        throw "missing canvas in SliderCanvas constructor"
    }
    if (typeof canvas == "string") {
        canvas = document.getElementById("canvas");
        if (!canvas) {
            throw "first argument to SliderCanvas constructor must be a canvas or canvas ID";
        }
    }
    this.canvas = canvas;
    this.graphics = null;
    if (canvas.getContext) {
        this.graphics = canvas.getContext("2d");
    }
    if (!this.graphics) {
        throw "can't create graphics context for canvas";
    }
    this.graphics.font = "14px sans-serif";
    var sliders = [];
    this.sliders = sliders;
    this.rightMargin = null;
    for (var i = 1; i < arguments.length; i++) {
        this.sliders.push( new SliderInfo(arguments[i]) );
    }
    var dragging = false;
    var touchStarted = false;
    var dragSlider;
    var startX;
    var tabLeftOffset;
    var me = this;
    function doMouseDown(evt) {
        if (dragging) {
            return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.clientX - r.left;
        var y = evt.clientY - r.top;
        for (var i = 0; i < sliders.length; i++ ) {
            var slider = sliders[i];
            if (slider.hitTab(x,y)) {
                dragging = true;
                dragSlider = i;
                tabLeftOffset = x - slider.tabLeft;
                startX = x;
                break;
            }
            else if (slider.hitBar(x,y)) {
                var oldValue = slider.value;
                if (slider.setBar(x)) {
                    me.onChange(slider.value, oldValue, i);
                    me.draw();
                }
                break;
            }
        }
        if (dragging) {
            canvas.addEventListener("mousemove",doMouseMove);
            document.addEventListener("mouseup",doMouseUp);
        }
    }
    function doMouseMove(evt) {
        if (!dragging) {
            return;
        }
        var r = canvas.getBoundingClientRect();
        var x = evt.clientX - r.left;
        var oldValue = sliders[dragSlider].value;
        var newTabLeft = x - tabLeftOffset;
        if (sliders[dragSlider].dragTab(newTabLeft)) {
            me.onChange(oldValue,sliders[dragSlider].value,dragSlider);
        }
        me.draw();
    }
    function doMouseUp(evt) {
        if (dragging) {
            dragging = false;
            canvas.removeEventListener("mousemove",doMouseMove);
            document.removeEventListener("mouseup",doMouseUp);
            evt.preventDefault();
            sliders[dragSlider].moveTabToValue();
            me.draw();
        }
    }
    function doTouchStart(evt) { 
        if (evt.touches.length != 1) {
           doTouchCancel();
           return;
        }
        if (touchStarted) {
            return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.touches[0].clientX - r.left;
        var y = evt.touches[0].clientY - r.top;
        var minDist = 1000000;
        var closest = -1;
        var i;
        for (i = 0; i < sliders.length; i++) {
            var d = sliders[i].distanceToTab(x,y);
            if (d < minDist) {
                minDist = d;
                closest = i;
            }
        }
        if (closest >= 0 && minDist < 100) {
             dragSlider = closest;
             tabLeftOffset = x - sliders[closest].tabLeft;
             startX = x;
             canvas.addEventListener("touchmove", doTouchMove);
             canvas.addEventListener("touchend", doTouchEnd);
             canvas.addEventListener("touchcancel", doTouchCancel);
             touchStarted = true;
             return;
        }
        for (var i = 0; i < sliders.length; i++ ) {
            var slider = sliders[i];
            if (slider.hitBar(x,y)) {
                evt.preventDefault();
                var oldValue = slider.value;
                if (slider.setBar(x)) {
                    me.onChange(slider.value, oldValue, i);
                    me.draw();
                }
                return;
            }
        }
    }
    function doTouchMove(evt) {
        if (evt.touches.length != 1 || !touchStarted) {
           doTouchCancel();
           return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.touches[0].clientX - r.left;
        var oldValue = sliders[dragSlider].value;
        var newTabLeft = x - tabLeftOffset;
        if (sliders[dragSlider].dragTab(newTabLeft)) {
            me.onChange(oldValue,sliders[dragSlider].value,dragSlider);
        }
        me.draw();
    }
    function doTouchEnd(evt) {
        doTouchCancel();
    }
    function doTouchCancel() {
        if (touchStarted) {
           touchStarted = false;
           canvas.removeEventListener("touchmove", doTouchMove);
           canvas.removeEventListener("touchend", doTouchEnd);
           canvas.removeEventListener("touchcancel", doTouchCancel);
        }
    }
    canvas.addEventListener("mousedown", doMouseDown);
    canvas.addEventListener("touchstart", doTouchStart);
}
SliderCanvas.prototype.onChange = function(/* newValue, oldValue, sliderNumber */) {
}
SliderCanvas.prototype.addSlider = function(sliderInfo) {
    this.sliders.push( new SliderInfo(sliderInfo) );
}
SliderCanvas.prototype.value = function(sliderNum) {
    return this.sliders[sliderNum].value;
}
SliderCanvas.prototype.setValue = function(sliderNum, value) {
    var val = this.sliders[sliderNum].setValue(value);
    this.draw();
    return val;
}
SliderCanvas.prototype.draw = function() {
    var i;
    if (this.rightMargin == null) {  // signal to compute right margin and slider lengths
        var labelSize = this.graphics.measureText("000000").width;
        var margin = 0;
        for (i = 0; i < this.sliders.length; i++) {
            var slider = this.sliders[i];
            if (slider.showValue) {
                margin = Math.max(margin,labelSize);
            }
            if (slider.label) {
                margin = Math.max(margin, this.graphics.measureText(slider.label + " =").width);
            }
        }
        margin = margin == 0? 10 : margin + 20;
        var length = this.canvas.width - margin - 15;
        this.rightMargin = margin;
        var spacing = this.canvas.height / (this.sliders.length + 1);
        for (i = 0; i < this.sliders.length; i++) {
            this.sliders[i].length = length;
            this.sliders[i].top = Math.round(spacing/2 + i*spacing) - 10;
            this.sliders[i].valueToTabLeft();
        }
    }
    this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (i = 0; i < this.sliders.length; i++) {
        this.sliders[i].draw(this.graphics);
    }
}

