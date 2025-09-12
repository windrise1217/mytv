import { useEffect, useRef, useState } from 'react';

export const useSettings = (defaultInterval: number) => {
	const [show, setShow] = useState(false);
	const [visible, setVisible] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [interval, setInterval] = useState(defaultInterval);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		browser.storage.local.get(['checkInterval'], (result) => {
			if (result.checkInterval) setInterval(result.checkInterval);
		});
	}, []);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (show) {
			setShouldRender(true);
			timeoutRef.current = setTimeout(() => setVisible(true), 10);
		} else if (visible) {
			setVisible(false);
			timeoutRef.current = setTimeout(() => setShouldRender(false), 300);
		} else {
			setShouldRender(false);
		}
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [show, visible]);

	const open = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setShow(true);
	};
	const close = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setShow(false);
	};
	const handleIntervalChange = (val: number) => {
		const safeVal = Math.max(5, val);
		setInterval(safeVal);
		browser.storage.local.set({ checkInterval: safeVal });
		browser.runtime.sendMessage({
			action: 'setAlarmInterval',
			interval: safeVal,
		});
	};

	return {
		show,
		visible,
		shouldRender,
		interval,
		setInterval: handleIntervalChange,
		open,
		close,
	};
};
