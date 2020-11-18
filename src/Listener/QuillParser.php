<?php

namespace Parasharrajat\Quill\Listener;

use Flarum\Formatter\Event\Parsing;
use s9e\TextFormatter\Utils;

class QuillParser
{
    public function handle(Parsing $parser)
    {
      var_dump($parser);
      $parser->disablePlugin('BBCodes');
        // $post = $event->context;

        // $event->xml = Utils::replaceAttributes($event->xml, 'POSTMENTION', function ($attributes) use ($post) {
        //     $post = $post->mentionsPosts->find($attributes['id']);
        //     if ($post && $post->user) {
        //         $attributes['displayname'] = $post->user->display_name;
        //     }

        //     return $attributes;
        // });
    }
}
