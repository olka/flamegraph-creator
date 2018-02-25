/**
 * Copyright 2015 Martin Spier. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.} name 
 */

function Node(name) {
    this.name = name;
    this.value = 0;
    this.children = {};
}

Node.prototype.add = function(frames, value) {
  this.value += value;
  if(frames && frames.length > 0) {
    var head = frames[0];
    var child = this.children[head];
    if(!child) {
      child = new Node(head);
      this.children[head] = child;
    }
    frames.splice(0, 1);
    child.add(frames, value);
  }
}

Node.prototype.serialize = function() {
  var res = {
    'n': this.name,
    'v': this.value
  }

  var children = []

  for(var key in this.children) {
    children.push(this.children[key].serialize());
  }

  if(children.length > 0) res['c'] = children;
  return res;
}

exports.folded = function(data) {
    var root = new Node('root');
    var regex = /(.*) (.*)/g;
    data.split("\n").map(function (val) {   
      var matches = regex.exec(val);
      if (matches) root.add(matches[1].split(";"), parseInt(matches[2]));        
    });
    return JSON.stringify(root.serialize());
}