var RemoteNode = {
  Base: {
    _remote_setValue: function(value) {
      var cellId = this._remote_getNodeId();
      var transform = {
        operation: 'set-value',
        source: this._remote_getNodeId(),
        newvalue: value
      };
      this.tree._remote_sendTransform(transform);
    }
  },
  
  _remote_getNodeId: function() {
    return "";
  },

};

module.exports = RemoteNode;