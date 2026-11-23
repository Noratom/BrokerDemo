import React, { useEffect, useRef, memo } from 'react';

const symbolMap = {
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  'EUR/USD': 'FX:EURUSD',
  'GBP/USD': 'FX:GBPUSD',
  'USD/JPY': 'FX:USDJPY',
  'GOLD': 'OANDA:XAUUSD',
  'OIL': 'TVC:USOIL'
};

function TradingViewChart({ selectedAsset = 'BTC/USD', interval = '15' }) {
  const containerRef = useRef(null);

  const tvSymbol = symbolMap[selectedAsset] || 'BINANCE:BTCUSDT';

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    widgetContainer.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: interval,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1', // 1 = Candlestick
      locale: 'en',
      enable_publishing: false,
      backgroundColor: '#090a0f',
      gridColor: 'rgba(255, 255, 255, 0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com'
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [tvSymbol, interval]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '420px', 
        minHeight: '380px',
        borderRadius: '8px', 
        overflow: 'hidden',
        background: '#090a0f'
      }} 
    />
  );
}

export default memo(TradingViewChart);
