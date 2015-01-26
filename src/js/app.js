'use strict';

var console = require('console-browserify'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    SwipeView = require('swipeview'),
    slides = require('./collections/slides');

// Bind jQuery to Backbone
Backbone.$ = $;

// Disable scrolling by default
document.addEventListener(
    'touchmove', function (e) { e.preventDefault(); }, false
);

// Gallery example
var gallery,
    el,
    i,
    page,
    dots = document.querySelectorAll('#nav li');

function update_img(el, page_number) {
    // Update img element
    el.className = 'loading';
    el.src = slides.at(page_number).attributes.img;
    el.width = slides.at(page_number).attributes.width;
    el.height = slides.at(page_number).attributes.height;
}

function create_img() {
    // Create and setup el element
    var el = document.createElement('img');

    el.onload = function () { this.className = ''; };

    // fixes for IE
    el.setAttribute("unselectable", "on");
    el.ondragstart = function() { return false; };

    return el;
}

function create_page(gallery, page_number) {
    // Create page and add to gallery
    console.log('Creating page: '+page_number);

    // Render and append image
    el = create_img();
    update_img(el, page_number);
    gallery.masterPages[i].appendChild(el);

    // Render and append description
    el = document.createElement('span');
    el.innerHTML = slides.at(page_number).attributes.desc;
    gallery.masterPages[i].appendChild(el);
}

function update_page(master_page, page_number) {
    // Update elements for particular page
    console.log('Updating page: '+page_number);

    el = master_page.querySelector('img');
    update_img(el, page_number);

    el = master_page.querySelector('span');
    el.innerHTML = slides.at(page_number).attributes.desc;
}

// Create and bind gallery object
gallery = new SwipeView('#wrapper', { numberOfPages: slides.length });
gallery.bind();

// Load initial data
var el;

for (i=0; i<3; i++) {
    page = i===0 ? slides.length-1 : i-1;

    create_page(gallery, page);
}

gallery.onFlip(function () {
    var el,
        upcoming,
        i,
        master_page;

    for (i=0; i<3; i++) {
        master_page = gallery.masterPages[i];

        upcoming = master_page.dataset.upcomingPageIndex;
        if (upcoming != master_page.dataset.pageIndex) {
            update_page(master_page, upcoming);
        }
    }

    document.querySelector('#nav .selected').className = '';
    dots[gallery.pageIndex+1].className = 'selected';
});

gallery.onMoveOut(function () {
    gallery.masterPages[gallery.currentMasterPage].className = gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/, '');
});

gallery.onMoveIn(function () {
    var className = gallery.masterPages[gallery.currentMasterPage].className;
    /(^|\s)swipeview-active(\s|$)/.test(className) || (gallery.masterPages[gallery.currentMasterPage].className = !className ? 'swipeview-active' : className + ' swipeview-active'); // jshint ignore:line
});
