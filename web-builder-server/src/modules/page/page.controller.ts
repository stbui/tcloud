import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PageService } from './page.service';
import { PageInterface } from './page.interface';
import { PageModel } from './page.model';

@Controller('page')
export class PageController {

    constructor(private readonly service: PageService) {

    }

    @Get()
    async query(): Promise<PageInterface[]> {
        return this.service.findAll();
    }

    @Get('/:name')
    async find(@Param('name') param) {
        return this.service.find({"name": param});
    }

    @Post()
    async create(@Body() body: PageModel) {
        return this.service.create(body);
    }

    @Get('all')
    async all() {
        return [
            {
                "id": 228990,
                "deleteStatus": "Normal",
                "seoTitle": "网站模板",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "首页",
                "seoKeyword": "",
                "domain": "?userId=228990",
                "pv": 0,
                "pageType": "normal",
                "sortId": 0,
                "renderId": "",
                "associateId": "",
                "viewWidth": 1200,
                "synchro": false
            },
            {
                "id": 228991,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "大赛介绍",
                "seoKeyword": "",
                "domain": "?userId=228991",
                "pv": 0,
                "pageType": "normal",
                "sortId": 1,
                "renderId": "",
                "associateId": "fd3eb775e7d84a70b9455ec68e2f329b",
                "viewWidth": 1200,
                "synchro": false
            },
            {
                "id": 228992,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "大赛排行榜",
                "seoKeyword": "",
                "domain": "?userId=228992",
                "pv": 0,
                "pageType": "normal",
                "sortId": 2,
                "renderId": "",
                "associateId": "fd3eb775e7d84a70b9455ec68e2f329b",
                "viewWidth": 1200,
                "synchro": false
            },
            {
                "id": 228993,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "数据掘金",
                "seoKeyword": "",
                "domain": "?userId=228993",
                "pv": 0,
                "pageType": "normal",
                "sortId": 3,
                "renderId": "",
                "associateId": "fd3eb775e7d84a70b9455ec68e2f329b",
                "viewWidth": 1200,
                "synchro": false
            },
            {
                "id": 228994,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "大赛动态",
                "seoKeyword": "",
                "domain": "?userId=228994",
                "pv": 0,
                "pageType": "normal",
                "sortId": 4,
                "renderId": "",
                "associateId": "fd3eb775e7d84a70b9455ec68e2f329b",
                "viewWidth": 1200,
                "synchro": false
            },
            {
                "id": 241381,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69792,
                "userId": 167569,
                "name": "我的账户",
                "seoKeyword": "",
                "domain": "?userId=241381",
                "pv": 0,
                "data": "",
                "pageType": "normal",
                "sortId": 5,
                "renderId": "",
                "associateId": "07d5edb9c36f422f8d19900c50f57962",
                "viewWidth": 1200,
                "synchro": false
            }
        ];
    }
}