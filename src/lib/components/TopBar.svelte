<!-- <div /> -->
<div class="topbar">
    <!-- <div class="movewidth" /> -->
    <div class="wrapper">
        <div class="mover"></div>
    </div>
</div>

<style>
    @keyframes move {
        0%,
        5% {
            transform: translateX(0%);
        }
        50% {
            transform: translateX(66%);
        }
        66% {
            transform: translateX(50%);
        }
        95%,
        100% {
            transform: translateX(calc(100% - 90px));
        }
    }
    @-webkit-keyframes move {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(calc(100% - 90px));
        }
    }
    .topbar {
        width: 100%;
        height: 5px;
        background: var(--primary500);
        top: 0;
        position: sticky;
        z-index: 999;
        overflow: hidden;
        .wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            -webkit-animation: move infinite 60s alternate-reverse linear;
            animation: move infinite 60s alternate-reverse linear;
        }
        .mover {
            top: 0;
            z-index: 1000;
            left: 0;
            width: 90px;
            height: 100%;
            background: linear-gradient(-45deg, var(--primary500), var(--primary300), var(--primary500));
            content: '';
            position: absolute;
        }
    }
</style>
