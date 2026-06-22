'use strict';
'require form';
'require uci';
'require view';
'require rpc';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: { '': {} }
});

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('sguautologin')
		]);
	},

	render: function(data) {
		var m, s, o;

		m = new form.Map('sguautologin', _('校园网自动登录'),
			_('基于 <a href="https://github.com/IDeLoveYou/SGU-Script" target="_blank">SGU-Script</a> 的韶关学院锐捷认证自动化登录工具。<br/>' +
			'开启后将自动检测网络并在断线时重新认证登录。'));

		s = m.section(form.TypedSection, 'login', _('基本设置'));
		s.anonymouse = true;
		s.filter = function(section_id) {
			return (section_id === 'sguautologin');
		};

		o = s.option(form.Flag, 'enabled', _('启用'));
		o.rmempty = false;
		o.default = '0';
		o.description = _('开启校园网自动登录服务');

		o = s.option(form.Value, 'username', _('用户名'));
		o.rmempty = false;
		o.placeholder = _('请输入校园网账号');
		o.password = false;
		o.description = _('校园网锐捷认证用户名');

		o = s.option(form.Value, 'password', _('密码'));
		o.rmempty = false;
		o.placeholder = _('请输入校园网密码');
		o.password = true;
		o.description = _('校园网锐捷认证密码');

		o = s.option(form.Flag, 'night_mode', _('夜间不断网模式'));
		o.rmempty = false;
		o.default = '0';
		o.description = _('勾选后，脚本将 24 小时运行，不受时间窗口限制。<br/>' +
			'仅在检测到网络断开时尝试重新登录，网络正常时不轮询打扰。<br/>' +
			'适用于网络 0 点断供但希望脚本等待网络恢复时自动重连的场景。');

		s = m.section(form.TypedSection, 'login', _('时段设置'));
		s.anonymouse = true;
		s.filter = function(section_id) {
			return (section_id === 'sguautologin');
		};

		o = s.option(form.ListValue, 'net_start', _('网络供应开始时间'));
		o.depends('night_mode', '0');
		o.default = '600';
		o.value('0', _('00:00'));
		o.value('500', _('05:00'));
		o.value('600', _('06:00'));
		o.value('700', _('07:00'));
		o.value('800', _('08:00'));
		o.description = _('工作日网络开始供应时间。勾选了"夜间不断网模式"后此项不生效。');

		o = s.option(form.ListValue, 'net_end', _('网络供应结束时间'));
		o.depends('night_mode', '0');
		o.default = '2400';
		o.value('2200', _('22:00'));
		o.value('2300', _('23:00'));
		o.value('2330', _('23:30'));
		o.value('2359', _('23:59'));
		o.value('2400', _('24:00 (00:00 断网)'));
		o.description = _('工作日网络结束供应时间。勾选了"夜间不断网模式"后此项不生效。');

		s = m.section(form.TypedSection, 'login', _('其他设置'));
		s.anonymouse = true;
		s.filter = function(section_id) {
			return (section_id === 'sguautologin');
		};

		o = s.option(form.Value, 'auth_url', _('认证服务器地址'));
		o.rmempty = false;
		o.default = 'http://172.16.253.121/quickauth.do';
		o.datatype = 'string';
		o.description = _('锐捷认证服务器的完整 URL 地址');

		o = s.option(form.Value, 'check_url', _('网络检测地址'));
		o.rmempty = false;
		o.default = 'http://2.2.2.2';
		o.datatype = 'string';
		o.description = _('用于检测网络是否已认证的 URL，未认证时会跳转到登录页面');

		o = s.option(form.ListValue, 'check_interval', _('检测间隔 (秒)'));
		o.default = '5';
		o.value('3', _('3 秒'));
		o.value('5', _('5 秒'));
		o.value('10', _('10 秒'));
		o.value('15', _('15 秒'));
		o.value('30', _('30 秒'));
		o.value('60', _('60 秒'));
		o.description = _('定时轮询间隔。勾选了"夜间不断网模式"后固定为 30 秒检测一次，此值不生效。');

		o = s.option(form.ListValue, 'logger_interval', _('日志间隔 (秒)'));
		o.default = '600';
		o.value('300', _('5 分钟'));
		o.value('600', _('10 分钟'));
		o.value('1200', _('20 分钟'));
		o.value('1800', _('30 分钟'));
		o.value('3600', _('60 分钟'));
		o.description = _('网络正常时输出日志的时间间隔，避免日志过多');

		return m.render();
	}
});
