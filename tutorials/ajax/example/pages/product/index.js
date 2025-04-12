import { BackButtonComponent } from '../../components/back-button/index.js';
import { ProductCardComponent } from '../../components/product-card/index.js';
import { ajax } from '../../modules/ajax.js';
import { stockUrls } from '../../modules/stockUrls.js';
import { MainPage } from '../main/index.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        ajax.get(stockUrls.getStockById(this.id), (data) => {
            this.renderData(data);
        });
    }

    renderData(item) {
        const product = new ProductCardComponent(this.pageRoot);
        product.render(item);
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
                <div id="product-page"></div>
            `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
