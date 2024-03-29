"use strict";
/**
 * Created by Le Reveur on 2017-10-29.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Page_1 = require("../libs/wiki/Page");
const WikiHelper_1 = require("../libs/wiki/WikiHelper");
let router = express_1.Router();
router.post('/parse', async (req, res) => {
    let page = new Page_1.TempPage(req.body.title);
    page.setSrc(req.body.text);
    page.getRen(null).then((ren) => {
        res.json({ ok: 1, result: ren });
    }).catch((e) => {
        res.status(500).json({ ok: 0, error: e.stack });
    });
});
router.get('/titleSearch', (req, res) => {
    WikiHelper_1.default.searchTitles(req.user, req.query.q)
        .then(result => {
        res.json({ ok: 1, result: result });
    })
        .catch(e => {
        res.json({ ok: 0, error: e });
    });
});
router.get('/src', async (req, res) => {
    let title = decodeURI(req.query.title);
    let user = req.user;
    try {
        let page = await Page_1.Page.load(title);
        if (page instanceof Page_1.NewPage)
            res.json({ ok: 1, result: { fulltitle: title, isNew: true, readOnly: !user, tags: [] } });
        else if (page instanceof Page_1.OldPage) {
            await page.getSrc(user);
            res.json({ ok: 1, result: page });
        }
    }
    catch (e) {
        res.json({ ok: 0, error: e.stack });
    }
});
router.post('/edit', async (req, res) => {
    let data = JSON.parse(req.body.data);
    if (!req.user)
        res.json({ ok: 0, error: (new Error('Login first.')).stack });
    else {
        try {
            let page = await Page_1.Page.load(data.fulltitle);
            page.setSrc(data.srcStr);
            page.setTags(data.tags);
            page.save(req.user).then(() => {
                res.json({ ok: 1 });
            });
        }
        catch (e) {
            res.json({ ok: 0, error: e.stack });
        }
    }
});
router.get('/admin', (req, res) => {
    if (!req.user.getAdmin()) {
        res.json({ ok: 0, error: new Error("You are not amin.") });
        return;
    }
    switch (req.query.action) {
        case 'getPAC':
            WikiHelper_1.default.getPAC(req.user, req.query.title)
                .then(result => {
                if (result)
                    res.json({ ok: 1, result: result });
                else
                    res.json({ ok: 0 });
            })
                .catch(e => {
                res.json({ ok: 0, error: e });
            });
            break;
        case 'setPAC':
            WikiHelper_1.default.setPAC(req.user, req.query.title, req.query.pac == "null" ? null : req.query.pac)
                .then(result => {
                if (result)
                    res.json({ ok: 1 });
                else
                    res.json({ ok: 0 });
            })
                .catch(e => {
                res.json({ ok: 0, error: e });
            });
            break;
    }
});
exports.default = router;
