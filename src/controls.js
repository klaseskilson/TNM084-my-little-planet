var InputControl = function(domElement, uniforms) {
  var self = this;
  self.uniforms = {};
  self.domElement = domElement || body;
  if (uniforms && Array.isArray(uniforms)) {
    _.each(uniforms, function (group) {
      _.each(group, function (uniform, key) {
        self.uniforms[key] = uniform;
      });
    });
  }
};

_.extend(InputControl.prototype, {
  /**
   * start general event listeners
   */
  startGeneralListeners: function startGeneralListeners() {
    var self = this;
    /**
     * private function to update uniform value
     * @param key       name of the uniform
     * @param filter    optional filter to apply to the values
     * @param callback  optional callback to overide the default callback
     * @returns {*|generalCallback}
     */
    var eventListener = function eventListener(key, filter, callback) {
      var uniform = self.uniforms[key] || {};
      // if callback is not provided, use default `generalCallback`
      return callback || function generalCallback(event) {
          // use filter if given, otherwise just pass through dummy function
          filter = filter || _.identity;
          var val = filter.call(null, event.target.value);
          console.info('changed', key, 'to', val);
          uniform.value = val;
        };
    };
    // select all number inputs with given keys
    // and append event listeners to them
    _.each(self.domElement.querySelectorAll('input[data-key][type=number]'), function (element) {
      var key = element.attributes['data-key'].value;
      element.addEventListener('input', eventListener(key, parseFloat));
    });
  },

  /**
   * start listeners with custom target/callbacks
   */
  startSpecificListeners: function startSpecificListeners() {
    var self = this;

    // all the other event listeners
    _.each([{
      selector: '#atmosphereColor',
      callback: self.colorCallback('atmosphereColor')
    }, {
      selector: '#temp',
      callback: function (event) {
        var defaultTemperature = 18;
        var value = parseFloat(event.target.value);
        var oceanLevel = Math.round((value - defaultTemperature) * 10) / 10;
        self.setUniform('oceanLevel', oceanLevel);
      }
    }], function (uniform) {
      var elem = self.domElement.querySelector(uniform.selector);
      if (elem) {
        var eventType = uniform.eventType || 'input';
        elem.addEventListener(eventType, uniform.callback);
      }
    });
  },

  /**
   * common function to use for updating color uniforms
   * @param key               the uniform key
   * @returns {colorCallback} event callback function
   */
  colorCallback: function (key) {
    var self = this;
    return function colorCallback(event) {
      var value = event.target.value;
      // handle `#` in hex if present
      if (value[0] === '#') {
        value = value.slice(0);
      }
      // convert from base 16 int
      var rgb = parseInt(value, 16);
      self.uniforms[key].value.set(rgb);

      // convert to other color space to set font color
      // http://stackoverflow.com/a/57805
      var r = (rgb >> 16) & 0xff;  // extract red
      var g = (rgb >>  8) & 0xff;  // extract green
      var b = (rgb >>  0) & 0xff;  // extract blue
      var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
      // set colors to element
      var fontColor = luma < 40 ? '#fff' : '#111';
      event.target.style.backgroundColor = '#' + value;
      event.target.style.color = fontColor;
    };
  },

  /**
   * update uniform
   * @param key         the uniform to update
   * @param value       the value to set
   * @param method      if any method should be used to set the value (eg `set`)
   * @param stringValue if the value has a specific string version
   */
  setUniform: function (key, value, method, stringValue) {
    console.log(arguments);
    var self = this;
    // check if method is provided
    if (method) {
      self.uniforms[key][method].apply(null, value);
    } else {
      self.uniforms[key].value = value;
    }
    // use provided stringValue
    var inputValue = stringValue || value;
    // set all the values with this key
    var elems = self.domElement.querySelectorAll('[data-key=' + key + ']');
    _.each(elems, function (elem) {
      elem.value = inputValue;
    });
  },

  /**
   * get uniform value if exists
   * @param key
   * @returns {*}
   */
  getUniform: function (key) {
    return this.uniforms[key] && this.uniforms[key].value;
  }
});
