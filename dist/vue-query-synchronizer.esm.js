/*!
 * @oarepo/vue-query-synchronizer v2.4.1
 * (c) Miroslav Simek <simeki@vscht.cz>
 * Released under the MIT License.
 */
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*
MIT License

Copyright (c) 2019 Mirek Simek (miroslav.simek@gmail.com), Daniel Bartoň

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function isObject(obj) {
  var type = _typeof(obj);

  return type === 'function' || type === 'object' && !!obj;
}

function convertParam(x, datatypes) {
  if (!isObject(x)) {
    x = x.split(':');

    if (x.length === 1) {
      x = ['string', x[0]];
    }

    var datatype = datatypes[x[0]];
    x = {
      datatype: datatype,
      defaultValue: datatype.parseDefault(x[1])
    };
  }

  if (x.datatype === undefined) {
    x.datatype = datatypes['string'];
  }

  return x;
} // https://gomakethings.com/how-to-check-if-two-arrays-are-equal-with-vanilla-js/


function arraysMatch(arr1, arr2) {
  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false; // Check if all items exist and are in the same order

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  } // Otherwise, return true


  return true;
}

var StringDatatype = {
  parseDefault: function parseDefault(value) {
    return value || '';
  },
  parse: function parse(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    }

    if (value && typeof value !== 'string') {
      console.error('Incorrect variable for parameter, expecting string, got', value);
      return defaultValue;
    }

    return value || '';
  },
  serialize: function serialize(value, defaultValue) {
    if (value === null || value === undefined || value === '' && !defaultValue) {
      return undefined;
    }

    return value === defaultValue ? undefined : value;
  }
};
var IntDatatype = {
  parseDefault: function parseDefault(value) {
    if (value.length) {
      return parseInt(value);
    }

    return 0;
  },
  parse: function parse(value, defaultValue) {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    value = parseInt(value);

    if (isNaN(value)) {
      return defaultValue;
    }

    return value;
  },
  serialize: function serialize(value, defaultValue) {
    if (value === null || value === undefined) {
      return undefined;
    }

    value = parseInt(value || 0);
    return value === defaultValue ? undefined : value.toString();
  }
};
var BoolDatatype = {
  parseDefault: function parseDefault(value) {
    return value === '1' || value === 'true';
  },
  parse: function parse(value, defaultValue) {
    if (value === undefined) {
      return defaultValue || false;
    }

    return true;
  },
  serialize: function serialize(value, defaultValue) {
    if (value === undefined) {
      return undefined;
    }

    if (value && value !== defaultValue) {
      return null;
    }

    return undefined;
  }
};
var ArrayDatatype = {
  parseDefault: function parseDefault(value) {
    if (value === undefined) {
      return [];
    }

    if (typeof value === 'string') {
      if (value !== '') {
        return [value];
      } else {
        return [];
      }
    }

    return value || [];
  },
  parse: function parse(value, defaultValue) {
    if (value === undefined) {
      return (defaultValue || []).slice();
    }

    if (typeof value === 'string') {
      return [value];
    }

    return value || [];
  },
  serialize: function serialize(value, defaultValue) {
    if (value === null || value === undefined || value.length === 0) {
      return undefined;
    }

    if (arraysMatch(value, defaultValue)) {
      return undefined;
    }

    if (value.length === 1) {
      return value[0];
    }

    return value;
  }
};

function separatedArrayDatatype(separator) {
  return {
    parseDefault: function parseDefault(value) {
      if (value === undefined) {
        return [];
      }

      if (typeof value === 'string') {
        if (value === '') {
          return [];
        }

        return value.split(separator);
      }

      return value || [];
    },
    parse: function parse(value, defaultValue) {
      if (value === undefined) {
        return (defaultValue || []).slice();
      }

      if (typeof value === 'string') {
        if (value === '') {
          return [];
        }

        return value.split(separator);
      }

      return value || [];
    },
    serialize: function serialize(value, defaultValue) {
      if (value === null || value === undefined || value.length === 0) {
        return undefined;
      }

      if (arraysMatch(value, defaultValue)) {
        return undefined;
      }

      return value.join(separator);
    }
  };
}

var CommaArrayDatatype = separatedArrayDatatype(',');
var SpaceArrayDatatype = separatedArrayDatatype(' ');
var QuerySynchronizer = {
  install: function install(Vue, _ref) {
    var router = _ref.router,
        datatypes = _ref.datatypes,
        debug = _ref.debug,
        navMethod = _ref.navMethod || 'push';
    datatypes = Object.assign({
      'string': StringDatatype,
      'bool': BoolDatatype,
      'int': IntDatatype,
      'array': ArrayDatatype,
      'commaarray': CommaArrayDatatype,
      'spacearray': SpaceArrayDatatype
    }, datatypes || {});
    var defaultStringParam = {
      datatype: StringDatatype,
      defaultValue: null
    }; // for easier debugging

    if (debug) {
      Object.entries(datatypes).forEach(function (d) {
        d[1].code = d[0];
      });
    }

    var _vue = new Vue({
      data: {
        routeName: null,
        urlquery: {},
        query: {},
        params: {},
        incr: 1
      }
    });

    var handler = {
      get: function get(target, prop) {
        if (prop in handler) {
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return handler[prop].apply(target, args);
          };
        }

        if (prop === '__self') {
          return target;
        }

        if (prop === '__incr') {
          return target.incr;
        }

        if (!(prop in target.query)) {
          var param = target.params[prop] || defaultStringParam;
          Vue.set(target.query, prop, param.datatype.parse(target.urlquery[prop], param.defaultValue));
        }

        return target.query[prop];
      },
      set: function set(target, prop, value) {
        if (value === undefined) {
          if (target.query[prop] !== undefined) {
            Vue.delete(target.query, prop);
            Vue.delete(target.urlquery, prop);
            target.incr += 1;
          }
        } else {
          var param = target.params[prop] || defaultStringParam;
          var serializedVal = param.datatype.serialize(value, param.defaultValue);

          if (serializedVal !== target.urlquery[prop]) {
            Vue.set(target.query, prop, value);

            if (serializedVal !== undefined) {
              Vue.set(target.urlquery, prop, serializedVal);
            } else {
              Vue.delete(target.urlquery, prop);
            }

            target.incr += 1;
          }
        }

        return true;
      },
      delete: function _delete(target, prop) {
        if (target.query[prop] !== undefined) {
          Vue.delete(target.query, prop);
          Vue.delete(target.urlquery, prop);
          target.incr += 1;
        }
      },
      has: function has(target, key) {
        return true; // key in target
      },
      ownKeys: function ownKeys(target) {
        var ret = new Set([].concat(_toConsumableArray(Object.keys(target.query)), _toConsumableArray(Object.keys(target.urlquery)), _toConsumableArray(Object.keys(target.params || {}))));
        ret.delete('toJSON');
        return _toConsumableArray(ret);
      },
      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, prop) {
        if (prop === 'toJSON') {
          return {
            configurable: true,
            enumerable: false
          };
        }

        return {
          configurable: true,
          enumerable: true
        };
      },
      getHTMLQuery: function getHTMLQuery() {
        return this.urlquery;
      },
      setQuery: function setQuery(newQuery) {
        var self = this;
        Object.keys(this.query).forEach(function (key) {
          delete self.query[key];
        });
        Object.keys(this.urlquery).forEach(function (key) {
          delete self.urlquery[key];
        });
        Object.assign(this.urlquery, newQuery);
      },
      define: function define(name, datatype, defaultValue) {
        this.params[name] = {
          datatype: datatype,
          defaultValue: defaultValue
        };
        var val = this.urlquery[name]; // do not make this firing a new event

        this.query[name] = datatype.parse(val, defaultValue);
      },
      addValue: function addValue(name, value, datatype) {
        if (this.params[name] === undefined) {
          query.define(name, datatype || ArrayDatatype, []);
        }

        var arr = query[name] || [];

        if (!Array.isArray(arr)) {
          arr = [arr];
        } else {
          arr = _toConsumableArray(arr);
        }

        var idx = arr.indexOf(value);

        if (idx < 0) {
          arr.push(value);
          query[name] = arr;
        }
      },
      removeValue: function removeValue(name, value, datatype) {
        if (this.params[name] === undefined) {
          query.define(name, datatype || ArrayDatatype, []);
        }

        var arr = query[name] || [];

        if (!Array.isArray(arr)) {
          arr = [arr];
        } else {
          arr = _toConsumableArray(arr);
        }

        var idx = arr.indexOf(value);
        arr.splice(idx, 1);
        query[name] = arr;
      }
    };
    var query = new Proxy(_vue, handler);
    Vue.prototype.$query = query;
    Vue.prototype.$rawQuery = _vue.query;
    router.afterEach(function (to) {
      if (!to.meta.query) {
        return;
      }

      var settings = to.meta.querySettings || {};

      if (_vue.routeName !== to.name) {
        if (debug) {
          console.log('Route name changed, replacing param definition with', to.meta.query);
        }

        _vue.routeName = to.name;
        var params = {};

        for (var k in to.meta.query) {
          params[k] = convertParam(to.meta.query[k], datatypes);
        }

        if (settings.onInit) {
          settings.onInit(params, query, _vue);
        }

        _vue.params = params;
        _vue.settings = settings;
      }

      query.setQuery(to.query);

      if (settings.onLoad) {
        settings.onLoad(query, _vue);
      }

      if (debug) {
        console.log('Setting query from router', to.query, _vue.urlquery);
      }
    });

    _vue.$watch('incr', function () {
      var existingQuery = router.currentRoute.query;
      var newQuery = query.getHTMLQuery();
      var modified = false;

      if (Object.keys(existingQuery).length === Object.keys(newQuery).length) {
        for (var _i = 0, _Object$keys = Object.keys(newQuery); _i < _Object$keys.length; _i++) {
          var k = _Object$keys[_i];
          var val = newQuery[k] !== null ? newQuery[k].toString() : null;

          if (val !== existingQuery[k].toString()) {
            if (debug) {
              console.log('Setting router from query: modified property', k, val, existingQuery[k]);
            }

            modified = true;
            break;
          }
        }
      } else {
        modified = true;
      }

      if (!modified) {
        return;
      }

      if (debug) {
        console.log('Setting router from query', newQuery);
      }

      if (_vue.settings.onChange) {
        _vue.settings.onChange(newQuery, query, _vue);
      }

      router[navMethod]({
        query: newQuery
      });
    });
  }
};

export default QuerySynchronizer;
export { ArrayDatatype, BoolDatatype, CommaArrayDatatype, IntDatatype, SpaceArrayDatatype, StringDatatype, separatedArrayDatatype };
