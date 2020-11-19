<?php

/*
 * This file is part of parasharrajat/flarum-quill.
 *
 * Copyright (c) 2020 Rajat Parashar.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Parasharrajat\Quill;

use Flarum\Extend;
use Flarum\Formatter\Event\Rendering;
use Flarum\Formatter\Event\Parsing;
use Parasharrajat\Quill\Listener;
use s9e\TextFormatter\Configurator;
use s9e\TextFormatter\Parser;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/css/quill.snow.css')
        ->css(__DIR__.'/resources/less/forum.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Formatter)
    ->configure(function (Configurator $config) {
        $configurator = $config;
        $configurator->rootRules->disableAutoLineBreaks();
        $htmlElements = array(
            'p',
            'br',
            'a',
            'b',
            'strong',
            'i',
            'em',
            'u',
            'h2',
            'h3',
            'ul',
            'ol',
            'li',
            'img',
        );

        foreach ($htmlElements as $el) {
            $configurator->HTMLElements->allowElement($el);
        }

        $configurator->HTMLElements->allowUnsafeElement('iframe');
        $configurator->HTMLElements->allowAttribute('a', 'href');
        $configurator->HTMLElements->allowAttribute('a', 'title');
        $configurator->HTMLElements->allowAttribute('img', 'src');
        $configurator->HTMLElements->allowAttribute('iframe', 'src');
        $configurator->HTMLElements->allowAttribute('iframe', 'width');
        $configurator->HTMLElements->allowAttribute('iframe', 'height');
        $configurator->HTMLElements->finalize();
        $config->enableJavaScript();
        // $config->javascript->setMinifier('ClosureCompilerService');
        $config->javascript->exports = [
            'parse',
            'preview'
        ];
    }),
];
