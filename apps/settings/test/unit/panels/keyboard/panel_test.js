'use strict';

suite('KeyboardPanel', function() {
  var map = {
    '*': {
      'modules/keyboard_context': 'MockKeyboardContext',
      'modules/settings_panel': 'MockSettingsPanel',
      'panels/keyboard/core': 'MockCore'
    }
  };

  setup(function(done) {
    this.fakeRootElement = {
      querySelector: function() {}
    };

    // Create a new requirejs context
    var requireCtx = testRequire([], map, function() {});
    var that = this;

    // Define MockKeyboardContext
    define('MockKeyboardContext', function() {
      return {};
    });

    // Define MockCore
    this.mockCore = {
      enabled: false,
      init: function() {}
    };
    this.MockCore = function() {
      return that.mockCore;
    };
    define('MockCore', function() {
      return that.MockCore;
    });

    // Define MockSettingsPanel
    define('MockSettingsPanel', function() {
      return function(options) {
        return {
          init: options.onInit,
          beforeShow: options.onBeforeShow,
          beforeHide: options.onBeforeHide,
          hide: options.onHide
        };
      };
    });

    requireCtx([
      'panels/keyboard/panel'
    ],
    function(KeyboardPanel) {
      that.panel = KeyboardPanel();
      done();
    });
  });

  test('Init the core when onInit', function() {
    sinon.spy(this.mockCore, 'init');
    this.panel.init(this.fakeRootElement);
    sinon.assert.called(this.mockCore.init);
  });

  test('Enabled the core when onBeforeShow', function() {
    this.panel.beforeShow();
    assert.ok(this.mockCore.enabled);
  });

  test('Disable the core when onHide', function() {
    this.panel.hide();
    assert.ok(!this.mockCore.enabled);
  });
});
