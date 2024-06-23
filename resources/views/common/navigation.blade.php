<?php

use App\Models\Edition;
use Illuminate\Database\Eloquent\Collection;

/**
 * @var Collection<string, Edition> $editions_list
 */
?>

<nav id="main-nav" class="mainNav">
    <ul>
        <li class="mainNav-item"><a href="/">Accueil</a></li>
        <li class="mainNav-item"><a href="{{ route("actus") }}">Actus</a></li>

        {{-- Editions list --}}
        @if(!empty($editions_list))

            {{-- Last edition --}}
                <?php
                /** @var Edition $lastEdition */
                $lastEdition = $editions_list->first();
                ?>
            @if($lastEdition)
                <li class="mainNav-item">
                    <a href="{{ route("edition", $lastEdition->slug) }}">{{ $lastEdition->title }}</a>

                    {{-- Last edition selections --}}
                    @if($lastEdition->selections->count() > 0)
                        <ul class="pl-2">
                            @foreach($lastEdition->selections as $selection)
                                <li class="mainNav-subItem">
                                    <a href="{{ route("selection", [$lastEdition, $selection]) }}">{{ $selection->name }}</a>
                                </li>
                            @endforeach
                        </ul>
                    @endif

                </li>
            @endif

            {{-- Archives of editions --}}
            @if($editions_list->count() > 1)
                <li class="mainNav-item">
                    <details>
                        <summary class="cursor-pointer">Éditions précédentes</summary>
                        <ul class="pl-2 mt-2">
                            @foreach($editions_list->slice(1) as $edition)
                                <li class="mainNav-subItem">
                                    <a href="{{ route("edition", $edition->slug) }}">{{ $edition->title }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </details>
                </li>
            @endif
        @endif

        <li class="mainNav-item"><a href="{{ route("about") }}">À Propos</a></li>
    </ul>
</nav>
