var Util = require('cts/util');

var RemoteTree = {
  Base: {
    loadRemote: function(spec) {
      var promise = Util.Promise.defer();
      if (! spec) {
        Util.Log.Error("No spec found to describe remote tree", this);
        return promise.reject("No spec found to describe remote tree.");
      }
      if (! spec.opts.name) {
        Util.Log.Error("No name found to identify remote tree.", this);
        return promise.reject("No name found to identify remote tree.");        
      }
      if ((! window.CTS) || (! window.CTS.engine) || (! window.CTS.engine.server)) {
        Util.Log.Error("Cloudstitch engine does not appear to have been loaded.");
        return promise.reject("Cloudstitch engine does not appear to have been loaded.");        
      }
      var name = spec.opts.name;
      var mode = spec.opts.mode || 'read';
      var authenticate = false;
      if (spec.authenticate) {
        authenticate = spec.authenticate;
      }
      var path = 'api/tree/' + name;
      var opts = {
        dataType: 'json',
        data: {
          mode: mode
        }
      };
      var jqXhr = CTS.engine.server.request(path, opts, (! authenticate));
      jqXhr.done(function(data) {
        promise.resolve(data);
      });
      jqXhr.fail(function(jqXhr, textStatus, errorThrown) {
        Util.Log.Error("Could not load remote tree from server.", textStatus, errorThrown);
        promise.reject("Could not load remote tree from server. Error message: " + textStatus);
      });
      return promise;
    },

    _remote_sendTransform: function(transform) {
      var promise = Util.Promise.defer();
      var name = this.spec.name;
      var authenticate = false;
      var path = 'api/tree/' + name + '/transform';
      var opts = {
        dataType: 'json',
        type: 'POST',
        data: {
          transform: transform
        }
      };

      var jqXhr = CTS.engine.server.request(path, opts, (! authenticate));
      jqXhr.done(function(data) {
        promise.resolve(data);
      });
      jqXhr.fail(function(jqXhr, textStatus, errorThrown) {
        Util.Log.Error("Could not load remote tree from server.", textStatus, errorThrown);
        promise.reject("Could not load remote tree from server. Error message: " + textStatus);
      });
      return promise;
    }
  }
};

module.exports = RemoteTree;