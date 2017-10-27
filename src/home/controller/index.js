'use strict';

import Base from './base.js';
import fs from 'fs';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        const {userId} = this.get();

        let pageId = userId || '228990';
        let filePath = `${think.ROOT_PATH}/template/${pageId}.html`;
        let fileData = fs.readFileSync(filePath, 'utf-8');

        this.assign('data',fileData);

        return this.display();
    }

}