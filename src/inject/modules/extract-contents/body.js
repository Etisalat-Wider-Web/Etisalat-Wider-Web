import uniqBy from 'lodash/uniqBy'
class Body {

    constructor() {
    }

    getStoriesFromContainers = (containerSections) => {
        const data = Array.from(containerSections).map((ele) => {
            return this.getStoryFromContainer(ele);
        }).filter(value => value?.title);
        return uniqBy(data, 'title');
    }

    getStoryFromContainer = containerSection => {
        if (!containerSection) {
            return null;
        }
        const title = $(containerSection).find('h3 a span:last-child').first().text() || $(containerSection).find('span[itemprop="headline"]').first().text();
        const image = $(containerSection).find('div[itemprop=image] img').first().attr('src') || '';
        const short_description = $(containerSection).find('p[itemprop=description]').first().text() || '';
        const href = $(containerSection).find('h3 a.headline-link').first().attr('href') || '';
        const detailContainer = containerSection.nextSibling;
        const subTitle = $(containerSection).find('a.section-fly').first().text() || $(containerSection).find('span.article__subheadline').first().text() || $(containerSection).find('a.headline-link span:first-child').first().text();
        const detail = Array.from($(detailContainer).find('> p.article__body-text')).map((item) => {
            return item.innerHTML.toString();
        }).join('<br />');
        return { title, image, subTitle, short_description, href, detail };
    }

    getMainStory = () => {
        const containerSection = document.querySelector('.layout-economist-today .ds-layout-grid .layout-news-analysis  > div');
        return this.getStoryFromContainer(containerSection)
    }

    getFirstStoryRelation = () => {
        const containerSection = document.querySelector('.layout-economist-today .ds-layout-grid .layout-news-analysis  > div:nth-child(3)');
        return this.getStoryFromContainer(containerSection)
    }

    getUnderRelationLeft = () => {
        const containerSections = document.querySelectorAll('.layout-economist-today .ds-layout-grid .layout-highlights  div[data-test-id]');
        return this.getStoriesFromContainers(containerSections);
    }

    getUnderRelationRight = () => {
        const containerSections = document.querySelectorAll('.layout-economist-today .ds-layout-grid .layout-economist-today-aside  div[data-test-id]');
        return this.getStoriesFromContainers(containerSections);
    }

    getRelationStory = () => {
        return [this.getFirstStoryRelation(), ...this.getUnderRelationLeft()]
    }

    getBottomRelation = () => {
        const containerSections = document.querySelectorAll('section.layout-common-collection .ds-layout-grid div[data-test-id]');
        return this.getStoriesFromContainers(containerSections);
    }

    getReaderFavourites = () => {
        const containerSections = document.querySelectorAll('div.layout-homepage-2fr section.layout-readers-favourites .ds-layout-grid div[data-test-id]');
        return this.getStoriesFromContainers(containerSections);
    }

    getAllArticle = (isFilter = false, hasImage = true) => {
        const containerSections = document.querySelectorAll('main div[data-test-id]:not([data-test-id="Lead Image"])');
        const detailContainer = document.querySelector('article > div.ds-layout-grid:first-child');
        const datas = this.getStoriesFromContainers([detailContainer, ...containerSections]);
        if (!isFilter) {
            return datas;
        }
        return datas.filter(({ image }) => (hasImage ? image : !image))
    }

    getSocialFooterLink = () => {
        const containers = document.querySelectorAll('footer ul li a[href].ds-share-link');
        return Array.from(containers).map((ele) => {
            const href = $(ele).attr('href');
            const icon = $(ele).html();
            return { href, icon }
        })
    }
}
export default new Body();