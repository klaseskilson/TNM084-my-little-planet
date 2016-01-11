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

  startSpecificListeners: function startSpecificListeners() {
    // all the other event listeners
    _.each([{
      selector: '',
      filter: parseFloat,
      callback: function specificCallback() {

      }
    }], function (thing) {
      var elem = self.domElement.querySelector(thing.selector);
      if (elem) {
        var eventType = thing.type || 'input';
        elem.addEventListener(eventType, thing.callback);
      }
    });
  }
});
