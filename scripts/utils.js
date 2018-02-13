function getGlobalCssProperty(name){
    return getComputedStyle(document.body).getPropertyValue('--'+name);
}