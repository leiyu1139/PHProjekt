define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom-class',
    'dijit/_Widget',
    'dijit/_TemplatedMixin',
    'dojo/topic',
    'dojo/text!phpr/template/menubar.html'
], function(declare, lang, on, clazz, widget, template, topic, templateString) {
    return declare([widget, template], {
        templateString: templateString,

        buildRendering: function() {
            this.inherited(arguments);
            this.own(
                on(this.startButton, 'click', lang.hitch(this, 'onStartClick')),
                on(this.bookingsButton, 'click', lang.hitch(this, 'onBookingsClick'))
            );
        },

        onStartClick: function() {
            topic.publish('phpr/showLiveBooking');
            clazz.replace(this.domNode, 'menubarOuter start');
        },

        onBookingsClick: function() {
            topic.publish('phpr/showBookings');
            clazz.replace(this.domNode, 'menubarOuter bookings');
        }
    });
});