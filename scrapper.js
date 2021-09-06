const puppeteer = require('puppeteer');

module.exports = {
  scrapFunc : async (key) => {
  let resultObj = {}
  let returnedResponse;
  let browser
  try {
    browser = await puppeteer.launch({
      headless:false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--disable-features=site-per-process',
        '--window-position=0,0',
        '--disable-extensions',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X   10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0    Safari/537.36"'
     ]
   });
   const page = await browser.newPage();
   await page.setViewport({ width: 0, height: 0 });
   await page.goto('https://www.amazon.com/s?k='+ key,{waitUntil: 'load', timeout: 30000});
   await page.waitForSelector('#search > div.s-desktop-width-max')


    returnedResponse = await page.evaluate(()=>{
    let elementArray = [];
    let dataArray = [];
    let searchWrapperSelector = '[data-asin]' && '[data-component-type="s-search-result"]';
    // let searchWrapperSelector = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div.s-result-item.s-asin';
    if(document.querySelectorAll(searchWrapperSelector).length > 0){
        let xyz = document.querySelectorAll(searchWrapperSelector)
        for(let divI = 0; divI<xyz.length;divI++){
            elementArray.push(xyz[divI])
        }
        let promise = new Promise((resolve,reject) =>{
            setTimeout(()=>{
                for(let text = 0; text < elementArray.length; text++){
                dataArray.push({
                "asin": elementArray[text].getAttribute("data-asin"),
                "productName":elementArray[text].querySelector('h2 > a > span').innerText,
                "productURL": elementArray[text].querySelector('h2 > a ').href,
                "productImg" : elementArray[text].querySelector('img.s-image ').src,
                // "price": elementArray[text].querySelector('div > span > div > div span.a-price-whole')?elementArray[text].querySelector('div > span > div > div span.a-price-whole').innerText.trim().replace(/\,/,""):'0',
                // "strike": elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen')?elementArray[text].querySelector('div > span > div > div span.a-price.a-text-price .a-offscreen').innerText.trim().substr(1,9).replace(/\,/,""):'0',
                // "rating": elementArray[text].querySelector('div > span > div > div a > i ')?elementArray[text].querySelector('div > span > div > div a > i').innerText:"",
                // "offer" :elementArray[text].querySelector('div > span > div > div > div.a-section.a-spacing-micro.s-grid-status-badge-container > a .a-badge .a-badge-text')?elementArray[text].querySelector('div > span > div > div > div.a-section.a-spacing-micro.s-grid-status-badge-container > a .a-badge .a-badge-text').innerText:''
                })
                resolve(dataArray)
                }
            },4000)
        })
        return promise;
    }
    })
    resultObj.product = returnedResponse
    console.log(resultObj.product)
    await browser.close();
    return resultObj.product;
  }
  catch(e){
      console.log('Amazon scrap error-> ',e);
      await browser.close();   
   }
}

};