
(function($, window, undefined){
	
	var $sidebar = $('.sidebar-menu'),
	$tabs = $sidebar.find('.treeview');
	
	var lsSidebarKey = 'sidebarTab';
	
	var curPath = window.localStorage.getItem(lsSidebarKey);
	
	// find target tab to active
	if(curPath){	
		$tabs.eq(curPath).addClass('active');
	}
	
	$sidebar.on('click','.treeview', function(e) {
		e.preventDefault();
		var curIdx =$(this).index();
		window.localStorage.setItem(lsSidebarKey, curIdx);
	});
})(jQuery, window);
