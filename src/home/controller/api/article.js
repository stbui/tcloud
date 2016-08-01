'use strict';

import Base from '../base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction(){
        let method = this.http.method.toLowerCase();
        if(method === "options"){
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();

        const _post = this.post();

        //this.success(_post);
        this.fail(200,'',_post)
    }

    setCorsHeader(){
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }
}