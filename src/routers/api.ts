/**
 * Created by Le Reveur on 2017-10-21.
 */
import {Router} from "express";
import User from "../libs/common/User";
import SingletonMysql from "../libs/common/SingletonMysql";

export default class ApiRouter {
    private router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/auth/login', (req, res) => {
            User.login(req.query.id, req.query.password)
                .then(user => {
                    req.session.user = user;
                    if (req.query.autoLogin == "true")
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; //7 days
                    res.json({ok: 1});
                })
                .catch(e => {
                    res.json({ok: e.code, error: e});
                });
        });

        this.router.get('/search/tag', (req, res) => {
            SingletonMysql.query('SELECT name, tagging_count as count FROM tag WHERE name LIKE ' + SingletonMysql.escape(req.query.q + '%'))
                .then(([rows]) => {
                    res.json({ok: 1, result: rows})
                })
                .catch(e => res.json({ok: 0, error: e.stack}));
        });
    }

    use(path, router) {
        this.router.use(path, router);
    }

    getRouter() {
        return this.router;
    }
}
