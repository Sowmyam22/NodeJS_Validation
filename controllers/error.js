exports.get404 = (req, res) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/page-not-found',
    });
}

exports.get500 = (req, res) => {
    res.status(500).render('500', {
        pageTitle: '500 Error',
        path: '/500',
    });
}