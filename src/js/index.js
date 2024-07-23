import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ymaps from 'ymaps';
import LoadingSpinner from './includes/LoadingSpinner';
import { ViewportProvider } from './utils/ViewportContext';

const loadComponent = (componentName) => {
    switch (componentName) {
        case 'mainFilter':
            return lazy(() => import('./components/MainFilter'));
        case 'contactForm':
        case 'contactFormModal':
            return lazy(() => import('./components/ContactForm'));
        case 'partnerCardList':
            return lazy(() => import('./components/PartnerCardList'));
        case 'searchPage':
            return lazy(() => import('./components/SearchPage'));
        case 'partnerLinks':
            return lazy(() => import('./components/PartnerLinks'));
        case 'premises':
            return lazy(() => import('./components/Premises'));
        case 'manager':
            return lazy(() => import('./components/Manager'));
        case 'tenants':
            return lazy(() => import('./components/Tenants'));
        case 'gallery':
            return lazy(() => import('./components/Gallery'));
        case 'presentation':
            return lazy(() => import('./components/Presentation'));
        case 'rentedCardList':
            return lazy(() => import('./components/RentedCardList'));
        case 'documents':
            return lazy(() => import('./components/DocumentsList'));
        case 'requests':
            return lazy(() => import('./components/RequestsList'));
        case 'siteEditor':
            return lazy(() => import('./components/SiteEditor'));
        case 'webReport':
            return lazy(() => import('./components/Report'));
        case 'tickets':
            return lazy(() => import('./components/Tickets'));
        case 'login':
            return lazy(() => import('./components/AuthLogin'));
        case 'signup':
            return lazy(() => import('./components/AuthRegister'));
        case 'resetPassword':
            return lazy(() => import('./components/AuthReset'));
        case 'promotionsCardList':
            return lazy(() => import('./components/PromotionsCardList'));

        default:
            return null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-react-component]');

    const renderApp = (componentName, container) => {
        const Component = loadComponent(componentName);

        if (!Component) return;

        ReactDOM.render(
            <ViewportProvider>
                <Router>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            {componentName === 'premises' && <Route path="/premises/:id" element={<Component />} />}
                            {componentName === 'signup' && (
                                <>
                                    <Route path="/auth/signup" element={<Component mode="signup" />} />
                                    <Route path="/auth/password-reset" element={<Component mode="password-reset" />} />
                                </>
                            )}
                            {componentName === 'resetPassword' && (
                                <>
                                    <Route path="/auth/reset/:token" element={<Component />} />
                                    <Route path="/auth/verify/:token" element={<Component />} />
                                </>
                            )}
                            {componentName === 'webReport' && (
                                <>
                                    <Route path="/api/report/print/depot" element={<Component base="depot" />} />
                                    <Route path="/api/report/print/gagarinsky" element={<Component base="gagarinsky" />} />
                                    <Route path="/api/report/print/yujnaya" element={<Component base="yujnaya" />} />
                                    <Route path="/backoffice/report" element={<Component />} />
                                </>
                            )}
                            {(componentName !== 'premises' && componentName !== 'signup' && componentName !== 'resetPassword' && componentName !== 'webReport') && (
                                <Route path="*" element={<Component {...(componentName === 'contactFormModal' && { modal: true })} />} />
                            )}
                        </Routes>
                    </Suspense>
                </Router>
            </ViewportProvider>,
            container
        );
    };

    containers.forEach((container) => {
        const componentName = container.getAttribute('data-react-component');
        renderApp(componentName, container);
    });
});

ymaps
    .load()
    .then(maps => {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.height = "100%";
            mapContainer.style.width = "100%";

            const map = new maps.Map(mapContainer, {
                center: [56.881433, 53.230957],
                zoom: 15,
                controls: [],
            });

            const myPlacemark = new maps.Placemark(map.getCenter(), {
                hintContent: 'Торгово-складской комплекс «Депо»',
                balloonContent: 'Торгово-складской комплекс «Депо»'
            }, {
                iconLayout: 'default#image',
                iconImageHref: '/img/icons/geoIcon.svg',
                iconImageSize: [40, 40],
            });

            map.geoObjects.add(myPlacemark);
        }
    })
    .catch(error => console.log('Failed to load Yandex Maps', error));
