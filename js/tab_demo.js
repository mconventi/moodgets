/**
 * Demo file for Moodgets library test: A widgets library built on mootools
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 */
window.addEvent('domready', function() {
    initDemo();
});
function initDemo() {		
	var g_tabPanel = new TabPanel($('tabPanel'));
	g_tabPanel.addTab('Existing tab', $('panel1'));
	var l_tabContent = 'This is an example of content for the TabPanel'; 
	var l_newTab = new Element('div', {'text': l_tabContent, styles:{'height':'200px', 'width':'400px', 'padding':'10px'}});
	g_tabPanel.addTab('Dynamic tab', l_newTab);
	g_tabPanel.activate(0);
};
