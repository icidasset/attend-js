(function(Namespace) {

"use strict";


function DOMObserver(el, callback) {
  if (!el) throw "Attend.js — DOMObserver, no element given";
  if (!callback) throw "Attend.js — DOMObserver, no callback given";

  this.el = el;
  this.callback = callback;

  this._create_mutation_observer();
};


DOMObserver.prototype.destroy = function() {
  this._destroy_mutation_observer();
};



//
//  Private
//
DOMObserver.prototype._create_mutation_observer = function() {
  if (this.mutation_observer) return;

  // new
  this.mutation_observer = new MutationObserver(
    this.callback
  );

  this.mutation_observer.observe(this.el, {
    childList: true,
    subtree: true
  });
};


DOMObserver.prototype._destroy_mutation_observer = function() {
  if (!this.mutation_observer) return;

  // delete
  this.mutation_observer.disconnect();
}



//
//  Exports
//
Namespace.DOMObserver = DOMObserver;


}(window.Attend));
