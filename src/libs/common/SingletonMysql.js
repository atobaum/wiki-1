/**
 * Created by Le Reveur on 2017-10-15.
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mysql2 = require('mysql2/promise');
var SingletonMysql = /** @class */ (function () {
    function SingletonMysql() {
    }
    ;
    SingletonMysql.checkInit = function () {
        if (SingletonMysql.pool === null)
            throw new Error("Error: initiate pool first. Use SingletonMysql.init(config)");
    };
    SingletonMysql.init = function (config) {
        if (SingletonMysql.pool)
            throw new Error("Error: already initiated. use SingletonMysql.getPool().");
        else
            SingletonMysql.pool = mysql2.createPool(config);
    };
    SingletonMysql.getPool = function () {
        SingletonMysql.checkInit();
        return SingletonMysql.pool;
    };
    /**
     * @async
     * @returns {Promise<IConnection>}
     */
    SingletonMysql.getConn = function () {
        SingletonMysql.checkInit();
        return SingletonMysql.pool.getConnection();
    };
    /**
     *
     * @async
     * @param query
     * @param params
     */
    SingletonMysql.query = function (query, params) {
        return SingletonMysql.getPool().query(query, params);
    };
    SingletonMysql.queries = function (work) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, SingletonMysql.getConn()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, work(conn)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4:
                        conn.release();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/, result];
                }
            });
        });
    };
    SingletonMysql.transaction = function (work) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, SingletonMysql.getConn()];
                    case 1:
                        conn = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 8]);
                        return [4 /*yield*/, conn.beginTransaction()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, work(conn)];
                    case 4:
                        result = _a.sent();
                        return [4 /*yield*/, conn.commit()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        e_2 = _a.sent();
                        return [4 /*yield*/, conn.rollback()];
                    case 7:
                        _a.sent();
                        conn.release();
                        throw e_2;
                    case 8:
                        conn.release();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SingletonMysql.pool = null;
    return SingletonMysql;
}());
exports["default"] = SingletonMysql;
