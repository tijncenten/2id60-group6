export default new class {
  parseThumb(url){
    url = url.substring(0, url.lastIndexOf('.'));
    url += "-thumb.jpg";
    return url;
  }

  parseSmall(url){
    url = url.substring(0, url.lastIndexOf('.'));
    url += "-small.jpg";
    return url;
  }
  
  parseNormal(url){
    url = url.substring(0, url.lastIndexOf('.'));
    url += "-normal.jpg";
    return url;
  }
}
