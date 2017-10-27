define([
		"pageHeader",
		"pageList",
		"elemLoad",
		"elemCtrl",
		"headerCtrl",
		"pageSetCtrl",
		"pageListCtrl",
		"design/application/QQCustomerService"
	], function(_ph, _pl, _el, _ec, _hc, _psc, _plc,_ps) {
	return {
		init: function() {
			_ph.init();
			_pl.init();
			_el.init();
			_ec.init();
			_hc.init();
			_psc.init();
			_plc.init();
		}
	}
});
