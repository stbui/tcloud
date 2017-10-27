'use strict';

import Base from '../base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  categoriesAction(){
    let method = this.http.method.toLowerCase();
    if (method === "options") {
      this.setCorsHeader();
      this.end();
      return;
    }
    this.setCorsHeader();

    return this.json([]);
  }

  uploadAction() {

  }

  dataAction() {
    let method = this.http.method.toLowerCase();
    if (method === "options") {
      this.setCorsHeader();
      this.end();
      return;
    }
    this.setCorsHeader();

    let result = {
      "totalCount" : 0,
      "pageNo" : 1,
      "pageSize" : 10000,
      "url" : "",
      "parames" : "",
      "data" : [ ],
      "startRows" : 0,
      "endRows" : 0,
      "totalPages" : 1,
      "hasPre" : false,
      "prePage" : 1,
      "hasNext" : false,
      "nextPage" : 1
    };

    return result;
  }

  setCorsHeader() {
    this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
    this.header("Access-Control-Allow-Headers", "x-requested-with");
    this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
    this.header("Access-Control-Allow-Credentials", "true");
  }
}