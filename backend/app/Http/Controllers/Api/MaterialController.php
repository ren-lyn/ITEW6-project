<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index()
    {
        return response()->json(Material::with('faculty')->get());
    }

    public function store(Request $request)
    {
        $material = Material::create($request->all());
        return response()->json($material, 201);
    }

    public function show(Material $material)
    {
        return response()->json($material->load('faculty'));
    }

    public function update(Request $request, Material $material)
    {
        $material->update($request->all());
        return response()->json($material);
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
