'use strict';
'require fs';
'require poll';
'require ui';
'require view';

var pollTimer = null;

var POLL_INTERVAL = 5;

return view.extend({
	retrieveSyslog: function() {
		return fs.exec_direct('/sbin/logread', ['-e', 'sguautologin']).catch(function() {
			return '';
		});
	},

	retrieveAppLog: function() {
		return fs.read('/var/log/sguautologin.log').catch(function() {
			return '';
		});
	},

	load: function() {
		poll.add(this.pollLog.bind(this), POLL_INTERVAL);
		return Promise.all([
			this.retrieveSyslog(),
			this.retrieveAppLog()
		]);
	},

	pollLog: function() {
		var self = this;
		Promise.all([
			self.retrieveSyslog(),
			self.retrieveAppLog()
		]).then(function(results) {
			var syslogEl = document.getElementById('syslog_content');
			var applogEl = document.getElementById('applog_content');
			if (syslogEl) {
				var lines = results[0] ? results[0].trim().split('\n').filter(Boolean) : [];
				syslogEl.value = lines.length > 0 ? lines.join('\n') : _('暂无系统日志');
				syslogEl.rows = Math.max(lines.length + 1, 10);
			}
			if (applogEl) {
				var lines = results[1] ? results[1].trim().split('\n').filter(Boolean) : [];
				applogEl.value = lines.length > 0 ? lines.join('\n') : _('暂无应用日志');
				applogEl.rows = Math.max(lines.length + 1, 10);
			}
		}).catch(function(err) {
			ui.addNotification(null, E('p', {}, _('读取日志失败: ' + err.message)));
		});
	},

	render: function(results) {
		var syslogText = results[0] || '';
		var applogText = results[1] || '';

		var syslogLines = syslogText.trim().split('\n').filter(Boolean);
		var applogLines = applogText.trim().split('\n').filter(Boolean);

		var scrollBtnStyle = 'display:flex; gap:10px; margin: 10px 0;';

		return E([], [
			E('h2', {}, _('校园网自动登录 - 运行日志')),

			/* System log (logread) */
			E('div', { 'class': 'cbi-section' }, [
				E('legend', {}, _('系统日志') + ' (logread -e sguautologin)'),
				E('div', { 'class': 'cbi-section-descr' },
					_('来自系统日志服务的运行信息，包含服务启停和认证状态。每 %s 秒自动刷新。').format(POLL_INTERVAL)),
				E('textarea', {
					'id': 'syslog_content',
					'style': 'width:100%; font-family:monospace; font-size:12px; background:#1a1a2e; color:#0ff; resize:vertical;',
					'readonly': 'readonly',
					'wrap': 'off',
					'rows': Math.max(syslogLines.length + 1, 10),
				}, [ syslogLines.length > 0 ? syslogLines.join('\n') : _('暂无系统日志') ]),
				E('div', { 'style': scrollBtnStyle }, [
					E('button', {
						'class': 'cbi-button cbi-button-neutral',
						'click': function() {
							var el = document.getElementById('syslog_content');
							if (el) el.scrollTop = el.scrollHeight;
						}
					}, _('滚动到底部')),
					E('button', {
						'class': 'cbi-button cbi-button-neutral',
						'click': function() {
							var el = document.getElementById('syslog_content');
							if (el) el.scrollTop = 0;
						}
					}, _('滚动到顶部'))
				])
			]),

			/* Application log file */
			E('div', { 'class': 'cbi-section', 'style': 'margin-top:20px;' }, [
				E('legend', {}, _('应用日志') + ' (/var/log/sguautologin.log)'),
				E('div', { 'class': 'cbi-section-descr' },
					_('应用自身记录的详细登录日志，包含认证结果和错误详情。')),
				E('textarea', {
					'id': 'applog_content',
					'style': 'width:100%; font-family:monospace; font-size:12px; background:#1a1a2e; color:#0f0; resize:vertical;',
					'readonly': 'readonly',
					'wrap': 'off',
					'rows': Math.max(applogLines.length + 1, 10),
				}, [ applogLines.length > 0 ? applogLines.join('\n') : _('暂无应用日志') ]),
				E('div', { 'style': scrollBtnStyle }, [
					E('button', {
						'class': 'cbi-button cbi-button-neutral',
						'click': function() {
							var el = document.getElementById('applog_content');
							if (el) el.scrollTop = el.scrollHeight;
						}
					}, _('滚动到底部')),
					E('button', {
						'class': 'cbi-button cbi-button-neutral',
						'click': function() {
							var el = document.getElementById('applog_content');
							if (el) el.scrollTop = 0;
						}
					}, _('滚动到顶部')),
					E('button', {
						'class': 'cbi-button cbi-button-reset',
						'click': function() {
							return fs.write('/var/log/sguautologin.log', '').then(function() {
								var el = document.getElementById('applog_content');
								if (el) {
									el.value = _('日志已清空');
									el.rows = 1;
								}
							});
						}
					}, _('清空应用日志'))
				])
			])
		]);
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
