'use strict';var _get=require('babel-runtime/helpers/get')['default'];var _inherits=require('babel-runtime/helpers/inherits')['default'];var _createClass=require('babel-runtime/helpers/create-class')['default'];var _classCallCheck=require('babel-runtime/helpers/class-call-check')['default'];var _regeneratorRuntime=require('babel-runtime/regenerator')['default'];var _interopRequireDefault=require('babel-runtime/helpers/interop-require-default')['default'];Object.defineProperty(exports,'__esModule',{value:true});var _toolsBigint=require('../tools/bigint');var _toolsBigint2=_interopRequireDefault(_toolsBigint);var _bluebird=require('bluebird');var _bluebird2=_interopRequireDefault(_bluebird);var _stream=require('stream');var _toolsSmb2Forge=require('../tools/smb2-forge');var requestAsync=_bluebird2['default'].promisify(_toolsSmb2Forge.request);var maxPacketSize=0x00010000;var SmbReadableStream=(function(_Readable){_inherits(SmbReadableStream,_Readable);function SmbReadableStream(connection,file){var options=arguments.length <= 2 || arguments[2] === undefined?{}:arguments[2];_classCallCheck(this,SmbReadableStream);_get(Object.getPrototypeOf(SmbReadableStream.prototype),'constructor',this).call(this,options);var _options$start=options.start;var start=_options$start === undefined?0:_options$start;var end=options.end;var encoding=options.encoding;this.connection = connection;this.encoding = encoding;this.file = file;this.offset = new _toolsBigint2['default'](8,start);var fileLength=0;for(var i=0;i < file.EndofFile.length;i++) {fileLength |= file.EndofFile[i] << i * 8;}this.fileLength = fileLength;this.wait = false;if(end >= 0 && end < fileLength){this.fileLength = end + 1;}}_createClass(SmbReadableStream,[{key:'_read',value:function _read(size){var rest,packetSize,offset,content;return _regeneratorRuntime.async(function _read$(context$2$0){while(1) switch(context$2$0.prev = context$2$0.next){case 0:if(!this.offset.lt(this.fileLength)){context$2$0.next = 17;break;}if(!this.wait){context$2$0.next = 3;break;}return context$2$0.abrupt('return');case 3:rest = this.offset.sub(this.fileLength).neg();packetSize = Math.min(maxPacketSize,rest.toNumber());offset = new _toolsBigint2['default'](this.offset);this.wait = true;context$2$0.next = 9;return _regeneratorRuntime.awrap(requestAsync('read',{FileId:this.file.FileId,Length:packetSize,Offset:offset.toBuffer()},this.connection));case 9:content = context$2$0.sent;this.wait = false;if(this.encoding){content = content.toString(this.encoding);}this.offset = this.offset.add(packetSize);if(this.push(content)){context$2$0.next = 15;break;}return context$2$0.abrupt('return');case 15:context$2$0.next = 0;break;case 17:if(!this.offset.ge(this.fileLength)){context$2$0.next = 21;break;}this.push(null);context$2$0.next = 21;return _regeneratorRuntime.awrap(requestAsync('close',this.file,this.connection));case 21:case 'end':return context$2$0.stop();}},null,this);}}]);return SmbReadableStream;})(_stream.Readable);exports['default'] = function(path,options,cb){var _this=this;if(typeof options === 'function'){cb = options;options = {};}(0,_toolsSmb2Forge.request)('open',{path:path},this,function(err,file){if(err){if(err.code === 'STATUS_OBJECT_NAME_NOT_FOUND'){err.code = 'ENOENT';}cb(err);}else {cb(null,new SmbReadableStream(_this,file,options));}});};module.exports = exports['default'];
//# sourceMappingURL=createReadStream.js.map