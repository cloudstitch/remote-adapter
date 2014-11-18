var Util = require("cts/util");

var RemoteNode = {
  Base: {
    _uploadFile: function(fileinput) {

    },

    _remote_nodeRemoved: function(removedNode) {
      var self = this;
      // this is parent node
      var transform = {
        operation: 'node-removed',
        source: this._remote_getNodeId(),
        value: removedNode._remote_getNodeId()
      };

      return self.tree._remote_sendTransform(transform); 
    },

    _remote_nodeInserted: function(insertedNode, value) {
      var self = this;
      // this is parent node
      var promises = [];
      if (value.row) {
        if (value.row.cols) {
          for (var key in value.row.cols) {
            var content = value.row.cols[key];
            if (content && (typeof content.o == 'object') && content.o) {
              if (content.o.t == 'fileinput') {
                var d = Util.Promise.defer();
                CTS.engine.server.uploadFiles(content.o.o).then(
                  function(urls) {
                    content.o = urls.join(',');
                    d.resolve();
                  },
                  function(err) {
                    content.o = '';
                    Util.Log.Error("Could not upload files");
                    d.resolve();
                  }
                ).done();
                promises.push(d);
              }
            }
          }
        }
      }

      var transform = {
        operation: 'node-inserted',
        source: this._remote_getNodeId(),
        value: value
      };

      if (promises.length > 0) {
        return Util.Promise.all(promises).then(
          function() {
            return self.tree._remote_sendTransform(transform); 
          }
        );
      } else {
        return this.tree._remote_sendTransform(transform); 
      }
      // "{"row":{"cols":{"A":{"o":"Something","i":"Show friends","fn":false},"B":{"o":"FALSE","i":"FALSE","fn":false}}},"schema":{"task":"A","done":"B"}}"
    }
  },
  
  _remote_getNodeId: function() {
    return "";
  }

};

module.exports = RemoteNode;