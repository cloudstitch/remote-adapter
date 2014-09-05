var Util = require('cts/util');

var RemoteTree = {
  Base: {
    loadRemote: function(spec) {
      var promise = Util.Promise.defer();
      if (! spec) {
        Util.Log.Error("No spec found to describe remote tree", this);
        return promise.reject("No spec found to describe remote tree.");
      }
      if (! spec.key) {
        Util.Log.Error("No key found to identify remote tree.", this);
        return promise.reject("No key found to identify remote tree.");        
      }
      if ((! window.CTS) || (! window.CTS.engine) || (! window.CTS.engine.server)) {
        Util.Log.Error("Cloudstitch engine does not appear to have been loaded.");
        return promise.reject("Cloudstitch engine does not appear to have been loaded.");        
      }
      var key = spec.key;
      var mode = spec.mode || 'read';
      var authenticate = false;
      if (spec.authenticate) {
        authenticate = spec.authenticate;
      }
      var path = '/api/tree/' + key;
      var opts = {
        dataType: 'json',
        data: {
          mode: read
        }
      };
      var jqXhr = CTS.engine.server.request(path, opts, (! authenticate));
      jqXhr.done(function(data) {
        promise.resolve(data);
      });
      jqXhr.fail(function(jqXhr, textStatus, errorThrown)) {
        Util.Log.Error("Could not load remote tree from server.", textStatus, errorThrown);
        promise.reject("Could not load remote tree from server. Error message: " + textStatus);
      });
      return promise;
    }
  }
};

module.exports = RemoteTree;