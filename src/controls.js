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
     * @returns {callback|generalCallback}
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
      element.value = self.getUniform(key);
      element.addEventListener('input', eventListener(key, parseFloat));
    });
  },

  /**
   * start listeners with custom target/callbacks
   */
  startSpecificListeners: function startSpecificListeners() {
    var self = this;
    var temperature = 18;
    var humidity = 0.4;

    var listeners = [{
      selector: '#atmosphereColor',
      callback: self.colorCallback('atmosphereColor')
    }, {
      selector: '#cloudColor',
      callback: self.colorCallback('cloudColor')
    }, {
      selector: '#temperature',
      callback: function (event) {
        // make ocean level depend on average temperature
        var value = parseFloat(event.target.value);
        var diff = value - temperature;
        self.applyDiff('oceanLevel', diff);
        temperature = value;
      }
    }, {
      selector: '#humidity',
      callback: function (event) {
        var percentage = parseFloat(event.target.value) / 100;
        var diff = percentage - humidity;
        // apply diff, 3 decimals, clamp between [0,1]
        self.applyDiff('cloudDensity', diff, function (v) {
          return self.clamp(self.floatPrecision(v, 3), 0, 1);
        });
        humidity = percentage;
      }
    }];

    // all the other event listeners
    _.each(listeners, function (listener) {
      var elems = self.domElement.querySelectorAll(listener.selector);
      _.each(elems, function (elem) {
        var eventType = listener.eventType || 'input';
        elem.addEventListener(eventType, listener.callback);
      });
    });
  },

  setupToggles: function () {
    var self = this;
    var elems = self.domElement.querySelectorAll('.toggle');
    _.each(elems, function (elem) {
      var target = elem.attributes['data-target'].value;
      var hideable = document.getElementById(target);
      elem.addEventListener('click', function () {
        var text = elem.innerHTML === 'hide' ? 'show' : 'hide';
        elem.innerHTML = text;
        hideable.classList.toggle('hidden');
      });
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
  },

  /**
   * apply diff to uniform value
   * @param key     uniform key
   * @param diff    the diff to apply
   * @param filter  optional filter function, accepts 1 param, defaults to `floatPrecision`
   */
  applyDiff: function (key, diff, filter) {
    var self = this;
    filter = filter || self.floatPrecision;
    var value = self.getUniform(key);
    value += diff;
    self.setUniform(key, filter.call(self, value));
  },

  /**
   * set decimal precision to number
   * @param f     the number
   * @param n     optional, the number of decimals, defaults 1
   * @returns {number}
   */
  floatPrecision: function (f, n) {
    n = n || 1;
    return Math.round(f * Math.pow(10, n)) / Math.pow(10, n);
  },

  /**
   * clamp value
   * @param value
   * @param min
   * @param max
   * @returns {number}
   */
  clamp: function (value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
});
