const scrollToElement = (element) => {
    if (!element) return;

    window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
    });
};

export default scrollToElement;
